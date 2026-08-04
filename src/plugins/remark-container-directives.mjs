import { visit } from 'unist-util-visit'

const admonitionTypes = {
  note: 'NOTE',
  tip: 'TIP',
  important: 'IMPORTANT',
  warning: 'WARNING',
  caution: 'CAUTION',
}

// Extract text from directive label
function getLabelText(node) {
  return node?.children
    ?.map(child => child.type === 'text' ? child.value : '')
    .join('')
    .trim() || ''
}

// Admonition Blocks
function createAdmonition(node, type, title) {
  const titleSpan = `<span class="admonition-title">${title}</span>`

  node.data ??= {}
  node.data.hName = 'blockquote'
  node.data.hProperties = {
    className: `admonition-${type}`,
  }

  node.children.unshift({
    type: 'html',
    value: titleSpan,
  })
}

// Collapsible Sections
function createFoldSection(node, title) {
  const summary = `<summary>${title}</summary>`

  node.data ??= {}
  node.data.hName = 'details'

  node.children.unshift({
    type: 'html',
    value: summary,
  })
}

// Gallery Containers
function createGallery(node) {
  node.data ??= {}
  node.data.hName = 'div'
  node.data.hProperties = {
    className: ['gallery-container'],
  }
}

export function remarkContainerDirectives() {
  const githubAdmonitionRegex = new RegExp(
    `^\\s*\\[!(${Object.values(admonitionTypes).join('|')})\\]\\s*`,
    'i',
  )

  return (tree) => {
    // Handle :::type[title] syntax
    visit(tree, 'containerDirective', (node) => {
      const type = node.name
      const labelNode = node.children?.[0]

      // Admonition Blocks
      if (admonitionTypes[type]) {
        // Optional [title] for admonitions
        let title = admonitionTypes[type]

        if (labelNode?.data?.directiveLabel) {
          const customTitle = getLabelText(labelNode)
          if (customTitle) {
            title = customTitle
          }
          node.children.shift()
        }

        createAdmonition(node, type, title)
        return
      }

      // Collapsible Sections
      if (type === 'fold') {
        // Require non-empty [title]
        const title = getLabelText(labelNode)
        if (!labelNode?.data?.directiveLabel || !title) {
          console.warn(`:::fold syntax requires [title] brackets with non-empty content`)
          return
        }

        node.children.shift()
        createFoldSection(node, title)
        return
      }

      // Gallery Containers
      if (type === 'gallery') {
        // Remove label if exists
        if (labelNode?.data?.directiveLabel) {
          node.children.shift()
        }

        createGallery(node)
      }
    })

    // Mark the TL;DR blockquote
    //
    // Every post opens with `> **TL;DR**: …`, which is the highest-value
    // block on the page and rendered identically to any other quote. Tagging
    // it here rather than introducing a `:::tldr` directive means no content
    // migration and no new syntax for the author to remember.
    visit(tree, 'blockquote', (node) => {
      const firstChild = node.children?.[0]?.children?.[0]
      if (!firstChild) {
        return
      }

      // `**TL;DR**: …` parses to a strong node; a plain `TL;DR: …` to text.
      const leadText = firstChild.type === 'strong'
        ? getLabelText(firstChild)
        : firstChild.type === 'text' ? firstChild.value : ''

      if (!/^TL;?DR\b/i.test(leadText.trim())) {
        return
      }

      // The label is promoted to its own line in CSS, which would strand the
      // separator that followed it inline. Drop it here so the summary starts
      // on its first real word.
      if (firstChild.type === 'strong') {
        const afterLabel = node.children[0].children[1]
        if (afterLabel?.type === 'text') {
          afterLabel.value = afterLabel.value.replace(/^\s*[:：]\s*/, '')
        }
      }

      node.data ??= {}
      node.data.hProperties = {
        ...node.data.hProperties,
        className: [...[node.data.hProperties?.className ?? []].flat(), 'tldr'],
      }
    })

    // Handle > [!TYPE] syntax
    visit(tree, 'blockquote', (node) => {
      const firstTextNode = node.children?.[0]?.children?.[0]
      if (firstTextNode?.type !== 'text') {
        return
      }

      const match = firstTextNode.value.match(githubAdmonitionRegex)
      if (!match) {
        return
      }

      const type = match[1].toLowerCase()
      const title = admonitionTypes[type]

      if (!title) {
        return
      }

      firstTextNode.value = firstTextNode.value.substring(match[0].length)

      createAdmonition(node, type, title)
    })
  }
}
