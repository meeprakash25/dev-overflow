import { Code } from "bright"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import type { Paragraph, Text } from "mdast"
import type { Node } from "unist"
import type { Plugin } from "unified"

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
}

const isParent = (node: Node): node is Node & { children: Node[] } =>
  "children" in node && Array.isArray(node.children)

const preserveJsxAsText: Plugin<[source: string]> = (source) => (tree) => {
  const replaceJsxNodes = (node: Node) => {
    if (!isParent(node)) return

    for (let index = 0; index < node.children.length; index += 1) {
      const child = node.children[index]

      if (child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement") {
        const start = child.position?.start.offset
        const end = child.position?.end.offset

        if (start === undefined || end === undefined) {
          throw new Error("Cannot render JSX as text because its source position is unavailable.")
        }

        const textNode: Text = {
          type: "text",
          value: source.slice(start, end),
          position: child.position,
        }
        if (child.type === "mdxJsxFlowElement") {
          const paragraph: Paragraph = {
            type: "paragraph",
            children: [textNode],
            position: child.position,
          }
          node.children[index] = paragraph
        } else {
          node.children[index] = textNode
        }
      } else {
        replaceJsxNodes(child)
      }
    }
  }

  replaceJsxNodes(tree)
}

export const Preview = ({ content = "" }: { content: string }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "")
  
  return <section className="markdown prose grid break-words">
    <MDXRemote source={ formattedContent } components={ { 
      pre:(props) => <Code { ...props } lineNumbers className="shadow-light-200 dark:shadow-dark-200"/>
     }} options={{ mdxOptions: { remarkPlugins: [remarkGfm, [preserveJsxAsText, formattedContent]] } }} />
  </section>
}

export default Preview
