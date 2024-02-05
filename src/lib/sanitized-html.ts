// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import sanitize from "sanitize-html";
/**
 * https://www.npmjs.com/package/sanitize-html
 */
const sanitizeOptions = {
    allowedTags: [
        "address",
        "article",
        "aside",
        "footer",
        "header",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hgroup",
        "main",
        "nav",
        "section",
        "blockquote",
        "dd",
        "div",
        "dl",
        "dt",
        "figcaption",
        "figure",
        "hr",
        "li",
        "main",
        "ol",
        "p",
        "pre",
        "ul",
        "a",
        "abbr",
        "b",
        "bdi",
        "bdo",
        "br",
        "cite",
        "code",
        "data",
        "dfn",
        "em",
        "i",
        "kbd",
        "mark",
        "q",
        "rb",
        "rp",
        "rt",
        "rtc",
        "ruby",
        "s",
        "samp",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "time",
        "u",
        "var",
        "wbr",
        "caption",
        "col",
        "colgroup",
        "table",
        "tbody",
        "td",
        "tfoot",
        "th",
        "thead",
        "tr",
    ],
    disallowedTagsMode: "discard",
    allowedAttributes: {
        "*": ["style"],
        a: ["href", "target"],
        p: ["class"],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
    },
    // Lots of these won't come up by default because we don't allow them
    selfClosing: ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta"],
    // URL schemes we permit
    // allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
    allowProtocolRelative: true,
    enforceHtmlBoundary: false,
    transformTags: {
        a: (tagName: any, attribs: { target: string; href: string }) => {
            attribs.target = "_blank"; // to open external lins in new tab
            attribs.href =
                attribs.href && attribs.href?.startsWith("http")
                    ? attribs.href
                    : `https://${attribs.href}`; //to convert all links which given in href to an external link

            return { tagName, attribs };
        },
        p: (tagName: any, attribs: { class: string }) => {
            attribs.class = "consent-text-p-tag-fixed-margin";
            return { tagName, attribs };
        },
    },
};
/**
 * Sanitize any HTML with options
 *
 * our default allowed tags h1, h2, h3, h4, h5, h6, em, blockquote, div, hr, li, ol, p, ul, a, b, br, i, small, span, strong, u, table, tbody, td, tfoot, th, thead, tr
 *
 * if you want to use your own options, it will be override to default options.Pls enter your options fully or extend default options.
 *
 * to see more options, visit https://www.npmjs.com/package/sanitize-html
 *
 */
export const sanitizeHtml = (dirtyHtml: string, sanitizeOption: any = sanitizeOptions) =>
    sanitize(dirtyHtml, sanitizeOption);
