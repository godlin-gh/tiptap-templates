export const calcYchangeStyle = (ychange: Record<string, any>) => {
  switch (ychange.type) {
    case 'removed':
      return `color:${ychange.color.dark}`
    case 'added':
      return `background-color:${ychange.color.light}`
    case null:
      return ''
  }
}

export const calcYchangeClass = (ychange: Record<string, any>) => {
  switch (ychange.type) {
    case 'removed':
      return `bg-teal-200 line-through`
    case 'added':
      return `bg-teal-400`
    default:
      return ''
  }
}

export const calcYchangeDomAttrs = (attrs: Record<string, any>, domAttrs: Record<string, any> = {}) => {
  domAttrs = Object.assign({}, domAttrs)
  if (attrs.ychange !== null) {
    domAttrs.ychange_user = attrs.ychange.user
    domAttrs.ychange_type = attrs.ychange.type
    domAttrs.ychange_color = attrs.ychange.color.light
    // domAttrs.style = calcYchangeStyle(attrs.ychange)
    domAttrs.class = calcYchangeClass(attrs.ychange)
  }
  return domAttrs
}

export const hoverWrapper = (ychange: any, els: Array<any>) =>
  ychange === null
    ? els
    : [
        [
          'span',
          {
            class: `ychange-hover ${calcYchangeClass(ychange)}`,
            // style: `background-color:${ychange.color.dark}`,
          },
          ychange.user || 'Unknown',
        ],
        ['span', ...els],
      ]
