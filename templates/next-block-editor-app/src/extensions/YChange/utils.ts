export const calcYchangeDomAttrs = (attrs: Record<string, any>, domAttrs: Record<string, any> = {}) => {
  domAttrs = Object.assign({}, domAttrs)
  if (attrs.ychange) {
    domAttrs.ychange_user = attrs.ychange.user
    domAttrs.ychange_type = attrs.ychange.type
  }
  return domAttrs
}

export const hoverWrapper = (ychange: any, els: Array<any>) => els
// export const hoverWrapper = (ychange: any, els: Array<any>) =>
//   ychange === null
//     ? els
//     : [
//         [
//           'span',
//           {
//             class: `ychange-hover ${calcYchangeClass(ychange)}`,
//             // style: `background-color:${ychange.color.dark}`,
//           },
//           ychange.user || 'Unknown',
//         ],
//         ['span', ...els],
//       ]
