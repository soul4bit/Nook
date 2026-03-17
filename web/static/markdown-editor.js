(() => {
  const BLOCK_ACTIONS = {
    h1: "# ",
    h2: "## ",
    h3: "### ",
    quote: "> ",
    ul: "- ",
    ol: "1. ",
    task: "- [ ] ",
  };
  const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
  const MAX_LINT_ISSUES = 8;
  const INLINE_WRAPPERS_WITH_TRIM = new Set(["**", "*", "~~", "`"]);
  const TASK_LIST_PATTERN = /^(\s*)([-+*])\s+\[(?: |x|X)\]\s?(.*)$/;
  const UNORDERED_LIST_PATTERN = /^(\s*)([-+*])\s+(.*)$/;
  const ORDERED_LIST_PATTERN = /^(\s*)(\d+)\.\s+(.*)$/;

  function escapeHTML(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function decodeEntities(value) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, "text/html");
    return doc.documentElement.textContent || "";
  }

  function sanitizeURL(raw) {
    const value = decodeEntities((raw || "").trim());
    if (value === "") {
      return "";
    }
    try {
      const url = new URL(value, window.location.origin);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.href;
      }
    } catch (_) {
      return "";
    }
    return "";
  }

  function replaceSelection(textarea, before, after, placeholder) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const source = textarea.value;
    const selectedRaw = source.slice(start, end);
    const selected = selectedRaw || placeholder;
    let replacement = `${before}${selected}${after}`;

    // Keep accidental outer spaces outside the formatting markers:
    // "word " + bold -> "**word** " instead of "**word **".
    if (selectedRaw !== "" && before === after && INLINE_WRAPPERS_WITH_TRIM.has(before)) {
      const leading = selectedRaw.match(/^\s+/)?.[0] || "";
      const trailing = selectedRaw.match(/\s+$/)?.[0] || "";
      const middle = selectedRaw.slice(leading.length, selectedRaw.length - trailing.length);
      if (middle !== "") {
        replacement = `${leading}${before}${middle}${after}${trailing}`;
      }
    }

    textarea.setRangeText(replacement, start, end, "end");
    const cursorPos = start + replacement.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
  }

  function detectListContinuation(line) {
    const taskMatch = line.match(TASK_LIST_PATTERN);
    if (taskMatch) {
      const [, indent, marker, content] = taskMatch;
      return {
        empty: content.trim() === "",
        continuation: `${indent}${marker} [ ] `,
        clearLine: indent,
      };
    }

    const orderedMatch = line.match(ORDERED_LIST_PATTERN);
    if (orderedMatch) {
      const [, indent, numberRaw, content] = orderedMatch;
      const currentNumber = Number.parseInt(numberRaw, 10);
      const nextNumber = Number.isFinite(currentNumber) ? currentNumber + 1 : 1;
      return {
        empty: content.trim() === "",
        continuation: `${indent}${nextNumber}. `,
        clearLine: indent,
      };
    }

    const unorderedMatch = line.match(UNORDERED_LIST_PATTERN);
    if (unorderedMatch) {
      const [, indent, marker, content] = unorderedMatch;
      return {
        empty: content.trim() === "",
        continuation: `${indent}${marker} `,
        clearLine: indent,
      };
    }

    return null;
  }

  function handleEditorEnter(textarea, event) {
    if (event.key !== "Enter" || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    if (textarea.selectionStart !== textarea.selectionEnd) {
      return;
    }

    const cursor = textarea.selectionStart;
    const source = textarea.value;
    const lineStart = source.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
    let lineEnd = source.indexOf("\n", cursor);
    if (lineEnd === -1) {
      lineEnd = source.length;
    }

    const line = source.slice(lineStart, lineEnd);
    const list = detectListContinuation(line);
    if (!list) {
      return;
    }

    event.preventDefault();

    if (list.empty) {
      textarea.setRangeText(list.clearLine, lineStart, lineEnd, "end");
      const cursorPos = lineStart + list.clearLine.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    } else {
      textarea.setRangeText(`\n${list.continuation}`, cursor, cursor, "end");
      const cursorPos = cursor + 1 + list.continuation.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }

    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function handleEditorTab(textarea, event) {
    if (event.key !== "Tab" || event.ctrlKey || event.altKey || event.metaKey) {
      return false;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const source = textarea.value;
    event.preventDefault();

    if (start === end) {
      if (event.shiftKey) {
        const lineStart = source.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
        if (source.startsWith("\t", lineStart)) {
          textarea.setRangeText("", lineStart, lineStart + 1, "end");
          const cursorPos = Math.max(lineStart, start - 1);
          textarea.setSelectionRange(cursorPos, cursorPos);
        } else if (source.startsWith("  ", lineStart)) {
          textarea.setRangeText("", lineStart, lineStart + 2, "end");
          const cursorPos = Math.max(lineStart, start - 2);
          textarea.setSelectionRange(cursorPos, cursorPos);
        }
      } else {
        textarea.setRangeText("  ", start, end, "end");
      }

      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }

    const lineStart = source.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
    let lineEnd = source.indexOf("\n", end);
    if (lineEnd === -1) {
      lineEnd = source.length;
    }

    const block = source.slice(lineStart, lineEnd);
    const lines = block.split("\n");
    const transformed = lines
      .map((line) => {
        if (!event.shiftKey) {
          return `  ${line}`;
        }
        if (line.startsWith("  ")) {
          return line.slice(2);
        }
        if (line.startsWith("\t")) {
          return line.slice(1);
        }
        return line;
      })
      .join("\n");

    textarea.setRangeText(transformed, lineStart, lineEnd, "end");
    textarea.setSelectionRange(lineStart, lineStart + transformed.length);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }

  function handleUndoRedoShortcuts(textarea, event) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) {
      return false;
    }

    const key = String(event.key || "").toLowerCase();
    const wantsUndo = key === "z" && !event.shiftKey;
    const wantsRedo = key === "y" || (key === "z" && event.shiftKey);
    if (!wantsUndo && !wantsRedo) {
      return false;
    }

    event.preventDefault();
    textarea.focus();

    try {
      if (typeof document.execCommand === "function") {
        document.execCommand(wantsUndo ? "undo" : "redo");
      }
    } catch (_) {
      // Ignore unsupported environments.
    }

    return true;
  }

  function insertMarkdownLinkForSelection(textarea, url) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedRaw = textarea.value.slice(start, end);
    const leading = selectedRaw.match(/^\s+/)?.[0] || "";
    const trailing = selectedRaw.match(/\s+$/)?.[0] || "";
    const middle = selectedRaw.slice(leading.length, selectedRaw.length - trailing.length).trim();
    const label = middle || "link";
    const replacement = `${leading}[${label}](${url})${trailing}`;
    textarea.setRangeText(replacement, start, end, "end");
    const cursorPos = start + replacement.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function handlePasteURLOverSelection(textarea, event) {
    if (!(event.clipboardData instanceof DataTransfer)) {
      return false;
    }
    if (textarea.selectionStart === textarea.selectionEnd) {
      return false;
    }

    const rawURL = event.clipboardData.getData("text/plain");
    const safeURL = sanitizeURL(rawURL);
    if (!safeURL) {
      return false;
    }

    event.preventDefault();
    insertMarkdownLinkForSelection(textarea, safeURL);
    textarea.focus();
    return true;
  }

  function prefixSelectionLines(textarea, prefix) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const source = textarea.value;

    const lineStart = source.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
    let lineEnd = source.indexOf("\n", end);
    if (lineEnd === -1) {
      lineEnd = source.length;
    }

    const block = source.slice(lineStart, lineEnd);
    const prefixed = block
      .split("\n")
      .map((line) => `${prefix}${line}`)
      .join("\n");

    textarea.setRangeText(prefixed, lineStart, lineEnd, "end");
    textarea.setSelectionRange(lineStart, lineStart + prefixed.length);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
  }

  function insertSnippet(textarea, snippet) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const source = textarea.value;
    const before = source.slice(0, start);
    const needsLeadingBreak = before !== "" && !before.endsWith("\n");
    const replacement = `${needsLeadingBreak ? "\n" : ""}${snippet}\n`;

    textarea.setRangeText(replacement, start, end, "end");
    const cursorPos = start + replacement.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
  }

  function insertLink(textarea, isImage) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end).trim();
    const label = selected || (isImage ? "image" : "link");

    const defaultURL = "https://";
    const rawURL = window.prompt(isImage ? "Image URL" : "Link URL", defaultURL);
    if (!rawURL) {
      return;
    }
    const safeURL = sanitizeURL(rawURL);
    if (!safeURL) {
      window.alert("Only http/https URLs are allowed.");
      return;
    }

    const replacement = isImage ? `![${label}](${safeURL})` : `[${label}](${safeURL})`;
    textarea.setRangeText(replacement, start, end, "end");
    const cursorPos = start + replacement.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
  }

  function suggestAltFromFilename(fileName) {
    const normalized = String(fileName || "")
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ")
      .trim();
    return normalized || "image";
  }

  function sanitizeMarkdownAltText(raw) {
    const value = String(raw || "")
      .replace(/\r\n/g, " ")
      .replace(/\r/g, " ")
      .replace(/\n/g, " ")
      .trim();
    if (value === "") {
      return "image";
    }
    return value.replace(/[[\]\\]/g, "\\$&");
  }

  function isImageFile(file) {
    return !!(file instanceof File && typeof file.type === "string" && file.type.startsWith("image/"));
  }

  async function uploadImageFile(textarea, file, options) {
    const uploadEndpoint = String(options && options.uploadEndpoint ? options.uploadEndpoint : "").trim();
    const csrfToken = String(options && options.csrfToken ? options.csrfToken : "").trim();

    if (!uploadEndpoint) {
      window.alert("Image upload is unavailable in this environment.");
      return false;
    }
    if (!isImageFile(file)) {
      window.alert("Choose an image file.");
      return false;
    }
    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      window.alert("Max file size is 10 MB.");
      return false;
    }

    const fallbackRangeStart = textarea.selectionStart;
    const fallbackRangeEnd = textarea.selectionEnd;
    const rangeStart = Number.isFinite(options && options.selectionStart)
      ? Number(options.selectionStart)
      : fallbackRangeStart;
    const rangeEnd = Number.isFinite(options && options.selectionEnd)
      ? Number(options.selectionEnd)
      : fallbackRangeEnd;
    const selectedText = textarea.value.slice(rangeStart, rangeEnd).trim();

    const formData = new FormData();
    formData.set("file", file, file.name || "image");

    try {
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "fetch",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data || data.ok !== true || typeof data.url !== "string" || data.url.trim() === "") {
        const message = data && typeof data.error === "string" ? data.error : "Upload failed.";
        throw new Error(message);
      }

      const safeURL = sanitizeURL(data.url);
      if (!safeURL) {
        throw new Error("Server returned an invalid URL.");
      }

      const alt = sanitizeMarkdownAltText(selectedText || suggestAltFromFilename(file.name));
      const markdownImage = `![${alt}](${safeURL})`;
      textarea.setRangeText(markdownImage, rangeStart, rangeEnd, "end");
      const cursorPos = rangeStart + markdownImage.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.focus();
      return true;
    } catch (error) {
      const fallback = "Image upload failed.";
      const message = error instanceof Error && error.message ? error.message : fallback;
      window.alert(message);
      return false;
    }
  }

  async function uploadAndInsertImage(textarea, options) {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "image/jpeg,image/png,image/gif,image/webp";

    picker.addEventListener(
      "change",
      () => {
        const file = picker.files && picker.files[0];
        if (!file) {
          return;
        }
        void uploadImageFile(textarea, file, {
          ...options,
          selectionStart: textarea.selectionStart,
          selectionEnd: textarea.selectionEnd,
        });
      },
      { once: true }
    );

    picker.click();
  }

  function handlePasteImageUpload(textarea, event, options) {
    if (!(event.clipboardData instanceof DataTransfer)) {
      return false;
    }

    const items = Array.from(event.clipboardData.items || []);
    const imageItem = items.find((item) => item.kind === "file" && item.type.startsWith("image/"));
    if (!imageItem) {
      return false;
    }

    const file = imageItem.getAsFile();
    if (!file) {
      return false;
    }

    event.preventDefault();
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    void uploadImageFile(textarea, file, { ...options, selectionStart, selectionEnd });
    return true;
  }

  function handleDropImageUpload(textarea, event, options) {
    if (!(event.dataTransfer instanceof DataTransfer)) {
      return false;
    }

    const files = Array.from(event.dataTransfer.files || []);
    const image = files.find((file) => isImageFile(file));
    if (!image) {
      return false;
    }

    event.preventDefault();
    textarea.focus();
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    void uploadImageFile(textarea, image, { ...options, selectionStart, selectionEnd });
    return true;
  }

  function renderInline(markdown) {
    let safe = escapeHTML(markdown);
    const tokens = [];
    const reserve = (html) => {
      const id = tokens.length;
      tokens.push(html);
      return `@@MDTOKEN${id}@@`;
    };

    safe = safe.replace(/`([^`\n]+)`/g, (_, code) => reserve(`<code>${code}</code>`));

    safe = safe.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, url, title) => {
      const safeURL = sanitizeURL(url);
      if (!safeURL) {
        return reserve(`<span class="atlas-md-bad-url">[blocked image]</span>`);
      }
      const altSafe = alt || "image";
      const titleSafe = title ? ` title="${escapeHTML(decodeEntities(title))}"` : "";
      return reserve(
        `<img src="${escapeHTML(safeURL)}" alt="${altSafe}"${titleSafe} loading="lazy" decoding="async" />`
      );
    });

    safe = safe.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, label, url, title) => {
      const safeURL = sanitizeURL(url);
      if (!safeURL) {
        return reserve(`<span class="atlas-md-bad-url">[blocked link]</span>`);
      }
      const titleSafe = title ? ` title="${escapeHTML(decodeEntities(title))}"` : "";
      return reserve(
        `<a href="${escapeHTML(safeURL)}" target="_blank" rel="noopener noreferrer"${titleSafe}>${label}</a>`
      );
    });

    safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    safe = safe.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    safe = safe.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    safe = safe.replace(/@@MDTOKEN(\d+)@@/g, (_, idx) => tokens[Number(idx)] || "");

    return safe;
  }

  function renderListItem(item) {
    const task = item.match(/^\[([ xX])\]\s+(.*)$/);
    if (!task) {
      return `<li>${renderInline(item)}</li>`;
    }

    const checked = task[1].toLowerCase() === "x";
    const label = renderInline(task[2]);
    return `<li><label><input type="checkbox" disabled${checked ? " checked" : ""} /> ${label}</label></li>`;
  }

  function isTableSeparatorLine(line) {
    return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);
  }

  function splitTableRow(line) {
    const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    return trimmed.split("|").map((cell) => cell.trim());
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    const chunks = [];
    let index = 0;

    const isStartOfBlock = (line) => {
      return (
        /^#{1,6}\s+/.test(line) ||
        /^>\s?/.test(line) ||
        /^```/.test(line) ||
        /^[-*+]\s+/.test(line) ||
        /^\d+\.\s+/.test(line) ||
        /^\s*\|.+\|\s*$/.test(line) ||
        /^\s*([-*_]){3,}\s*$/.test(line)
      );
    };

    while (index < lines.length) {
      const line = lines[index];

      if (/^\s*$/.test(line)) {
        index += 1;
        continue;
      }

      if (/^```/.test(line)) {
        const lang = line.replace(/^```/, "").trim();
        const code = [];
        index += 1;
        while (index < lines.length && !/^```/.test(lines[index])) {
          code.push(lines[index]);
          index += 1;
        }
        if (index < lines.length && /^```/.test(lines[index])) {
          index += 1;
        }
        const langClass = lang ? ` class="language-${escapeHTML(lang)}"` : "";
        chunks.push(`<pre><code${langClass}>${escapeHTML(code.join("\n"))}</code></pre>`);
        continue;
      }

      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        chunks.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
        index += 1;
        continue;
      }

      if (/^\s*([-*_]){3,}\s*$/.test(line)) {
        chunks.push("<hr />");
        index += 1;
        continue;
      }

      if (line.includes("|") && index + 1 < lines.length && isTableSeparatorLine(lines[index + 1])) {
        const headerCells = splitTableRow(line);
        index += 2;

        const bodyRows = [];
        while (index < lines.length && !/^\s*$/.test(lines[index]) && lines[index].includes("|")) {
          bodyRows.push(splitTableRow(lines[index]));
          index += 1;
        }

        const head = `<thead><tr>${headerCells.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead>`;
        const body = `<tbody>${bodyRows
          .map((row) => {
            const normalized = [...row];
            while (normalized.length < headerCells.length) {
              normalized.push("");
            }
            return `<tr>${normalized.slice(0, headerCells.length).map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`;
          })
          .join("")}</tbody>`;

        chunks.push(`<table>${head}${body}</table>`);
        continue;
      }

      if (/^>\s?/.test(line)) {
        const quote = [];
        while (index < lines.length && /^>\s?/.test(lines[index])) {
          quote.push(lines[index].replace(/^>\s?/, ""));
          index += 1;
        }
        chunks.push(`<blockquote><p>${renderInline(quote.join("\n")).replaceAll("\n", "<br />")}</p></blockquote>`);
        continue;
      }

      if (/^[-*+]\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^[-*+]\s+/.test(lines[index])) {
          items.push(lines[index].replace(/^[-*+]\s+/, ""));
          index += 1;
        }
        chunks.push(`<ul>${items.map((item) => renderListItem(item)).join("")}</ul>`);
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
        const items = [];
        while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
          items.push(lines[index].replace(/^\d+\.\s+/, ""));
          index += 1;
        }
        chunks.push(`<ol>${items.map((item) => renderListItem(item)).join("")}</ol>`);
        continue;
      }

      const paragraph = [];
      while (index < lines.length && !/^\s*$/.test(lines[index]) && !isStartOfBlock(lines[index])) {
        paragraph.push(lines[index]);
        index += 1;
      }
      chunks.push(`<p>${renderInline(paragraph.join("\n")).replaceAll("\n", "<br />")}</p>`);
    }

    return chunks.join("");
  }

  function collectMarkdownLintIssues(markdown) {
    const lines = String(markdown || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    const issues = [];
    let fenceOpenLine = 0;

    for (let idx = 0; idx < lines.length; idx += 1) {
      const lineNumber = idx + 1;
      const line = lines[idx];
      const fenceMatch = line.match(/^```/);
      if (fenceMatch) {
        if (fenceOpenLine === 0) {
          fenceOpenLine = lineNumber;
        } else {
          fenceOpenLine = 0;
        }
        continue;
      }

      if (fenceOpenLine !== 0) {
        continue;
      }

      const normalizedLine = line
        .replace(/`[^`\n]*`/g, "")
        .replace(/\\\*/g, "");
      const strongPattern = /(^|[^\\])\*\*([^*\n]+)\*\*/g;
      let hasBoldSpaceIssue = false;
      let strongMatch = strongPattern.exec(normalizedLine);
      while (strongMatch) {
        const content = strongMatch[2] || "";
        if (/^\s|\s$/.test(content)) {
          hasBoldSpaceIssue = true;
          break;
        }
        strongMatch = strongPattern.exec(normalizedLine);
      }

      if (hasBoldSpaceIssue) {
        issues.push({
          line: lineNumber,
          message: "Пробел внутри **...**: в финале может показаться сырой markdown.",
        });
      }

      const links = line.matchAll(/!?\[[^\]]*]\(([^)\s]+)\)/g);
      for (const match of links) {
        const rawURL = match[1] || "";
        if (!sanitizeURL(rawURL)) {
          issues.push({
            line: lineNumber,
            message: "Ссылка/картинка с некорректным URL (только http/https).",
          });
        }
      }
    }

    if (fenceOpenLine !== 0) {
      issues.push({
        line: fenceOpenLine,
        message: "Незакрытый код-блок ```.",
      });
    }

    return issues.slice(0, MAX_LINT_ISSUES);
  }

  function buildToolbarButton(label, action, titleText) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "atlas-md-btn";
    button.dataset.mdAction = action;
    button.textContent = label;
    button.title = titleText;
    return button;
  }

  function initEditor(textarea) {
    const wrapper = document.createElement("div");
    wrapper.className = "atlas-md-editor";

    const toolbar = document.createElement("div");
    toolbar.className = "atlas-md-toolbar";
    const form = textarea.closest("form");
    const uploadEndpoint = form instanceof HTMLFormElement ? (form.dataset.mediaUploadEndpoint || "").trim() : "";
    const csrfInput = form instanceof HTMLFormElement ? form.querySelector("input[name='csrf_token']") : null;
    const csrfToken = csrfInput instanceof HTMLInputElement ? csrfInput.value.trim() : "";

    const toolbarButtons = [
      ["H1", "h1", "Big title"],
      ["H2", "h2", "Section title"],
      ["H3", "h3", "Small title"],
      ["B", "bold", "Bold"],
      ["I", "italic", "Italic"],
      ["Code", "code", "Inline code"],
      ["Code+", "codeblock", "Code block"],
      ["Quote", "quote", "Quote block"],
      ["List", "ul", "Bulleted list"],
      ["1.", "ol", "Numbered list"],
      ["Task", "task", "Checklist item"],
      ["Table", "table", "Insert table"],
      ["Hr", "hr", "Horizontal rule"],
      ["Link", "link", "Insert link"],
      ["Image", "image", "Insert image URL"],
    ];
    if (uploadEndpoint) {
      toolbarButtons.push(["Upload", "upload-image", "Upload image from device"]);
    }

    for (const [label, action, titleText] of toolbarButtons) {
      toolbar.append(buildToolbarButton(label, action, titleText));
    }

    const modeSwitch = document.createElement("div");
    modeSwitch.className = "atlas-md-mode";

    const writeBtn = buildToolbarButton("Write", "mode-write", "Edit markdown");
    writeBtn.classList.add("atlas-md-btn-active");
    writeBtn.dataset.mdMode = "write";
    const previewBtn = buildToolbarButton("Preview", "mode-preview", "Preview rendered markdown");
    previewBtn.dataset.mdMode = "preview";
    const splitBtn = buildToolbarButton("Split", "mode-split", "Write and preview side by side");
    splitBtn.dataset.mdMode = "split";

    modeSwitch.append(writeBtn, previewBtn, splitBtn);

    const meta = document.createElement("div");
    meta.className = "atlas-md-meta";
    const stats = document.createElement("p");
    stats.className = "atlas-md-stats";
    meta.append(stats, modeSwitch);
    toolbar.append(meta);

    const body = document.createElement("div");
    body.className = "atlas-md-body";

    const preview = document.createElement("div");
    preview.className = "atlas-md-preview";
    preview.hidden = true;

    const lint = document.createElement("div");
    lint.className = "atlas-md-lint";
    lint.hidden = true;

    textarea.classList.add("atlas-md-input");
    textarea.dataset.mdEditorReady = "1";

    textarea.parentNode.insertBefore(wrapper, textarea);
    wrapper.append(toolbar);
    wrapper.append(body);
    body.append(textarea);
    body.append(preview);
    wrapper.append(lint);

    let currentMode = "write";
    let syncLock = false;

    const renderPreview = () => {
      preview.innerHTML = renderMarkdown(textarea.value.trim());
    };

    const updateStats = () => {
      const source = textarea.value;
      const trimmed = source.trim();
      const chars = source.length;
      const words = trimmed === "" ? 0 : trimmed.split(/\s+/).filter(Boolean).length;
      const readMins = words > 0 ? Math.max(1, Math.round(words / 180)) : 0;
      stats.textContent = words > 0 ? `${words} слов | ${chars} знаков | ~${readMins} мин чтения` : "0 слов | 0 знаков";
    };

    const renderLint = () => {
      const issues = collectMarkdownLintIssues(textarea.value);
      if (issues.length === 0) {
        lint.hidden = true;
        lint.innerHTML = "";
        return;
      }

      lint.hidden = false;
      const items = issues
        .map(
          (issue) =>
            `<li><button type="button" class="atlas-md-lint-link" data-md-line="${issue.line}">Строка ${issue.line}</button><span>${escapeHTML(issue.message)}</span></li>`
        )
        .join("");
      lint.innerHTML = `<p class="atlas-md-lint-title">Проверьте Markdown:</p><ul class="atlas-md-lint-list">${items}</ul>`;
    };

    const setMode = (mode) => {
      currentMode = mode;
      const previewMode = mode === "preview";
      const splitMode = mode === "split";
      writeBtn.classList.toggle("atlas-md-btn-active", mode === "write");
      previewBtn.classList.toggle("atlas-md-btn-active", previewMode);
      splitBtn.classList.toggle("atlas-md-btn-active", splitMode);
      wrapper.classList.toggle("atlas-md-editor-split", splitMode);

      textarea.hidden = previewMode;
      preview.hidden = !(previewMode || splitMode);

      if (previewMode || splitMode) {
        renderPreview();
      }
    };

    toolbar.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }
      const action = target.dataset.mdAction;
      if (!action) {
        return;
      }

      switch (action) {
        case "bold":
          replaceSelection(textarea, "**", "**", "bold text");
          break;
        case "italic":
          replaceSelection(textarea, "*", "*", "italic text");
          break;
        case "code":
          replaceSelection(textarea, "`", "`", "code");
          break;
        case "codeblock":
          insertSnippet(textarea, "```bash\n# command\n```");
          break;
        case "table":
          insertSnippet(textarea, "| Column 1 | Column 2 |\n| --- | --- |\n| Value | Value |");
          break;
        case "hr":
          insertSnippet(textarea, "---");
          break;
        case "link":
          insertLink(textarea, false);
          break;
        case "image":
          insertLink(textarea, true);
          break;
        case "upload-image":
          void uploadAndInsertImage(textarea, { uploadEndpoint, csrfToken });
          break;
        case "h1":
        case "h2":
        case "h3":
        case "quote":
        case "ul":
        case "ol":
        case "task":
          prefixSelectionLines(textarea, BLOCK_ACTIONS[action]);
          break;
        case "mode-write":
          setMode("write");
          break;
        case "mode-preview":
          setMode("preview");
          break;
        case "mode-split":
          setMode("split");
          break;
        default:
          break;
      }
    });

    textarea.addEventListener("input", () => {
      if (currentMode === "preview" || currentMode === "split") {
        renderPreview();
      }
      renderLint();
      updateStats();
    });

    const syncScroll = (sourceNode, targetNode) => {
      if (syncLock || currentMode !== "split") {
        return;
      }

      syncLock = true;
      const sourceMax = Math.max(sourceNode.scrollHeight - sourceNode.clientHeight, 1);
      const targetMax = Math.max(targetNode.scrollHeight - targetNode.clientHeight, 1);
      const ratio = sourceNode.scrollTop / sourceMax;
      targetNode.scrollTop = ratio * targetMax;
      syncLock = false;
    };

    textarea.addEventListener("scroll", () => {
      syncScroll(textarea, preview);
    });

    preview.addEventListener("scroll", () => {
      syncScroll(preview, textarea);
    });

    textarea.addEventListener("keydown", (event) => {
      if (handleUndoRedoShortcuts(textarea, event)) {
        return;
      }
      if (handleEditorTab(textarea, event)) {
        return;
      }
      handleEditorEnter(textarea, event);
    });

    textarea.addEventListener("paste", (event) => {
      if (uploadEndpoint && handlePasteImageUpload(textarea, event, { uploadEndpoint, csrfToken })) {
        return;
      }
      handlePasteURLOverSelection(textarea, event);
    });

    wrapper.addEventListener("dragover", (event) => {
      if (!(event.dataTransfer instanceof DataTransfer)) {
        return;
      }

      const hasImage = Array.from(event.dataTransfer.items || []).some(
        (item) => item.kind === "file" && item.type.startsWith("image/")
      );
      if (!hasImage) {
        return;
      }

      event.preventDefault();
      wrapper.classList.add("atlas-md-editor-dragover");
    });

    wrapper.addEventListener("dragleave", () => {
      wrapper.classList.remove("atlas-md-editor-dragover");
    });

    wrapper.addEventListener("drop", (event) => {
      wrapper.classList.remove("atlas-md-editor-dragover");
      if (!uploadEndpoint) {
        return;
      }
      handleDropImageUpload(textarea, event, { uploadEndpoint, csrfToken });
    });

    lint.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }
      const line = Number.parseInt(target.dataset.mdLine || "", 10);
      if (!Number.isFinite(line) || line < 1) {
        return;
      }

      let cursor = 0;
      let currentLine = 1;
      const source = textarea.value;
      while (currentLine < line) {
        const nextBreak = source.indexOf("\n", cursor);
        if (nextBreak === -1) {
          break;
        }
        cursor = nextBreak + 1;
        currentLine += 1;
      }

      setMode("write");
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });

    renderLint();
    updateStats();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const editors = document.querySelectorAll("textarea[data-md-editor]");
    for (const node of editors) {
      if (!(node instanceof HTMLTextAreaElement)) {
        continue;
      }
      initEditor(node);
    }
  });
})();

