"use client"
// InitializedMDXEditor.tsx
import type { ClipboardEvent, ForwardedRef } from "react"
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertCodeBlock,
  InsertThematicBreak,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor"
import "@mdxeditor/editor/style.css"
import { basicDark } from "cm6-theme-basic-dark"
import "./dark.editor.css"
import { useTheme } from "next-themes"
import { Separator } from "@base-ui/react"

const clipboardCodeToText = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ""
  if (node.nodeType !== Node.ELEMENT_NODE) return ""

  const element = node as HTMLElement
  if (element.tagName === "BR") return "\n"

  const text = Array.from(element.childNodes, clipboardCodeToText).join("")
  return ["DIV", "LI", "P"].includes(element.tagName) || element.style.display === "block" ? `${text}\n` : text
}

const clipboardNodeToMarkdown = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ""
  if (node.nodeType !== Node.ELEMENT_NODE) return ""

  const element = node as HTMLElement
  const children = Array.from(element.childNodes, clipboardNodeToMarkdown).join("")
  const content = children.trim()

  if (element.tagName === "PRE") {
    const code = element.querySelector("code") ?? element
    const language = `${element.className} ${code.className}`.match(/(?:language|lang)-([\w+#.-]+)/i)?.[1] ?? ""
    const codeText = clipboardCodeToText(code).replace(/\r\n?/g, "\n").replace(/\n+$/, "")
    const backtickCount = Math.max(0, ...(codeText.match(/`+/g) ?? []).map((run) => run.length))
    const tildeCount = Math.max(0, ...(codeText.match(/~+/g) ?? []).map((run) => run.length))
    const fence =
      backtickCount <= tildeCount ? "`".repeat(Math.max(3, backtickCount + 1)) : "~".repeat(Math.max(3, tildeCount + 1))
    return `${fence}${language}\n${codeText}\n${fence}\n\n`
  }

  if (element.tagName === "BR") return "\n"
  if (element.tagName === "SCRIPT" || element.tagName === "STYLE") return ""
  if (/^H[1-6]$/.test(element.tagName)) return `${"#".repeat(Number(element.tagName[1]))} ${content}\n\n`
  if (element.tagName === "P") return `${content}\n\n`
  if (element.tagName === "BLOCKQUOTE") {
    return `${content
      .split("\n")
      .map((line) => (line ? `> ${line}` : ">"))
      .join("\n")}\n\n`
  }
  if (element.tagName === "UL" || element.tagName === "OL") {
    const items = Array.from(element.children).filter((child) => child.tagName === "LI")
    return `${items
      .map((item, index) => {
        const itemContent = clipboardNodeToMarkdown(item).trim().replace(/\n+/g, " ")
        const marker = element.tagName === "OL" ? `${index + 1}.` : "-"
        return `${marker} ${itemContent}`
      })
      .join("\n")}\n\n`
  }
  if (element.tagName === "A")
    return element.getAttribute("href") ? `[${content}](${element.getAttribute("href")})` : children
  if (element.tagName === "STRONG" || element.tagName === "B") return `**${content}**`
  if (element.tagName === "EM" || element.tagName === "I") return `*${content}*`
  if (element.tagName === "CODE") return `\`${content}\``
  if (element.tagName === "DEL" || element.tagName === "S") return `~~${content}~~`
  if (element.tagName === "DIV" || element.tagName === "SECTION" || element.tagName === "ARTICLE") {
    return content ? `${children.trim()}\n\n` : ""
  }

  return children
}

interface Props {
  value: string
  fieldChange: (value: string) => void
  editorRef: ForwardedRef<MDXEditorMethods> | null
}

// Only import this to the next file
const Editor = ({ value, fieldChange, editorRef, ...props }: Props) => {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? [basicDark] : []

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const html = event.clipboardData.getData("text/html")
    if (!/<pre\b/i.test(html)) return

    const clipboardDocument = new DOMParser().parseFromString(html, "text/html")
    const markdown = Array.from(clipboardDocument.body.childNodes, clipboardNodeToMarkdown)
      .join("")
      .replace(/^\n+|\n+$/g, "")
    const editor = editorRef && typeof editorRef === "object" ? editorRef.current : null

    if (!markdown || !editor) return

    event.preventDefault()
    event.stopPropagation()
    editor.insertMarkdown(`\n\n${markdown}\n\n`)
  }

  return (
    <div onPasteCapture={handlePaste}>
      <MDXEditor
        key={resolvedTheme}
        markdown={value}
        ref={editorRef}
        className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border grid"
        onChange={fieldChange}
        plugins={[
          // Example Plugin Usage
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          imagePlugin(),
          codeBlockPlugin(),
          codeMirrorPlugin({
            codeBlockLanguages: {
              css: "css",
              txt: "txt",
              sql: "sql",
              html: "sass",
              scss: "scss",
              bash: "bash",
              json: "json",
              js: "javascript",
              ts: "typescript",
              tsx: "TypeScript(React)",
              jsx: "JavaScript(React)",
              "": "unspecified",
            },
            autoLoadLanguageSupport: true,
            codeMirrorExtensions: theme,
          }),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
          toolbarPlugin({
            toolbarContents: () => (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />
                        <Separator />

                        <BoldItalicUnderlineToggles />
                        <Separator />

                        <ListsToggle />
                        <Separator />

                        <CreateLink />
                        <InsertImage />
                        <Separator />

                        <InsertTable />
                        <InsertThematicBreak />

                        <InsertCodeBlock />
                      </>
                    ),
                  },
                ]}
              />
            ),
          }),
        ]}
        {...props}
      />
    </div>
  )
}

export default Editor
