import { element } from "./element.mjs";
import { atom, reactive } from "atomi";

/**
 * @typedef {import('./element.mjs').RenderableChild} RenderableChild
 */

/**
 * @callback Element
 * @param {Object.<string, any>}                  [options={}]    - attributes
 * @param {RenderableChild}                       [children]
 * @param {Object}                                [hooks]
 * @param {function(HTMLElement):void}            [hooks.mount]   - callback when element is
 *                                                                  rendered in the DOM tree
 * @param {function(HTMLElement):void}            [hooks.unmount] - callback when element is
 *                                                                  removed from the DOM tree
 * @returns {HTMLElement|Promise<HTMLElement>}
 */

/**
 * Inteded use is to render lazy render content once the condition is fulfilled;
 * @param {function():boolean}         condition
 * @param {function():RenderableChild} content
 */
export function once(condition, content) {
  const [result, setResult] = atom();
  reactive(scope => {
    if (condition()) {
      scope.stop();
      setResult(content());
    }
  });
  return result;
}

/**
 * @type {Element}
 */
export function a(options, children, hooks) {
  return element("a", options, children, hooks);
}

/**
 * @type {Element}
 */
export function abbr(options, children, hooks) {
  return element("abbr", options, children, hooks);
}

/**
 * @type {Element}
 */
export function address(options, children, hooks) {
  return element("address", options, children, hooks);
}

/**
 * @type {Element}
 */
export function area(options, children, hooks) {
  return element("area", options, children, hooks);
}

/**
 * @type {Element}
 */
export function article(options, children, hooks) {
  return element("article", options, children, hooks);
}

/**
 * @type {Element}
 */
export function audio(options, children, hooks) {
  return element("audio", options, children, hooks);
}

/**
 * @type {Element}
 */
export function b(options, children, hooks) {
  return element("b", options, children, hooks);
}

/**
 * @type {Element}
 */
export function base(options, children, hooks) {
  return element("base", options, children, hooks);
}

/**
 * @type {Element}
 */
export function bdi(options, children, hooks) {
  return element("bdi", options, children, hooks);
}

/**
 * @type {Element}
 */
export function bdo(options, children, hooks) {
  return element("bdo", options, children, hooks);
}

/**
 * @type {Element}
 */
export function blockquote(options, children, hooks) {
  return element("blockquote", options, children, hooks);
}

/**
 * @type {Element}
 */
export function body(options, children, hooks) {
  return element("body", options, children, hooks);
}

/**
 * @type {Element}
 */
export function br(options, children, hooks) {
  return element("br", options, children, hooks);
}

/**
 * @type {Element}
 */
export function button(options, children, hooks) {
  return element("button", options, children, hooks);
}

/**
 * @type {Element}
 */
export function canvas(options, children, hooks) {
  return element("canvas", options, children, hooks);
}

/**
 * @type {Element}
 */
export function caption(options, children, hooks) {
  return element("caption", options, children, hooks);
}

/**
 * @type {Element}
 */
export function cite(options, children, hooks) {
  return element("cite", options, children, hooks);
}

/**
 * @type {Element}
 */
export function code(options, children, hooks) {
  return element("code", options, children, hooks);
}

/**
 * @type {Element}
 */
export function col(options, children, hooks) {
  return element("col", options, children, hooks);
}

/**
 * @type {Element}
 */
export function colgroup(options, children, hooks) {
  return element("colgroup", options, children, hooks);
}

/**
 * @type {Element}
 */
export function data(options, children, hooks) {
  return element("data", options, children, hooks);
}

/**
 * @type {Element}
 */
export function datalist(options, children, hooks) {
  return element("datalist", options, children, hooks);
}

/**
 * @type {Element}
 */
export function dd(options, children, hooks) {
  return element("dd", options, children, hooks);
}

/**
 * @type {Element}
 */
export function del(options, children, hooks) {
  return element("del", options, children, hooks);
}

/**
 * @type {Element}
 */
export function details(options, children, hooks) {
  return element("details", options, children, hooks);
}

/**
 * @type {Element}
 */
export function dfn(options, children, hooks) {
  return element("dfn", options, children, hooks);
}

/**
 * @type {Element}
 */
export function dialog(options, children, hooks) {
  return element("dialog", options, children, hooks);
}

/**
 * @type {Element}
 */
export function div(options, children, hooks) {
  return element("div", options, children, hooks);
}

/**
 * @type {Element}
 */
export function dl(options, children, hooks) {
  return element("dl", options, children, hooks);
}

/**
 * @type {Element}
 */
export function dt(options, children, hooks) {
  return element("dt", options, children, hooks);
}

/**
 * @type {Element}
 */
export function em(options, children, hooks) {
  return element("em", options, children, hooks);
}

/**
 * @type {Element}
 */
export function dmbed(options, children, hooks) {
  return element("dmbed", options, children, hooks);
}

/**
 * @type {Element}
 */
export function fieldset(options, children, hooks) {
  return element("fieldset", options, children, hooks);
}

/**
 * @type {Element}
 */
export function figcaption(options, children, hooks) {
  return element("figcaption", options, children, hooks);
}

/**
 * @type {Element}
 */
export function figure(options, children, hooks) {
  return element("figure", options, children, hooks);
}

/**
 * @type {Element}
 */
export function footer(options, children, hooks) {
  return element("footer", options, children, hooks);
}

/**
 * @type {Element}
 */
export function form(options, children, hooks) {
  return element("form", options, children, hooks);
}

/**
 * @type {Element}
 */
export function h1(options, children, hooks) {
  return element("h1", options, children, hooks);
}

/**
 * @type {Element}
 */
export function h2(options, children, hooks) {
  return element("h2", options, children, hooks);
}

/**
 * @type {Element}
 */
export function h3(options, children, hooks) {
  return element("h3", options, children, hooks);
}

/**
 * @type {Element}
 */
export function h4(options, children, hooks) {
  return element("h4", options, children, hooks);
}

/**
 * @type {Element}
 */
export function h5(options, children, hooks) {
  return element("h5", options, children, hooks);
}

/**
 * @type {Element}
 */
export function h6(options, children, hooks) {
  return element("h6", options, children, hooks);
}

/**
 * @type {Element}
 */
export function head(options, children, hooks) {
  return element("head", options, children, hooks);
}

/**
 * @type {Element}
 */
export function header(options, children, hooks) {
  return element("header", options, children, hooks);
}

/**
 * @type {Element}
 */
export function hr(options, children, hooks) {
  return element("hr", options, children, hooks);
}

/**
 * @type {Element}
 */
export function html(options, children, hooks) {
  return element("html", options, children, hooks);
}

/**
 * @type {Element}
 */
export function i(options, children, hooks) {
  return element("i", options, children, hooks);
}

/**
 * @type {Element}
 */
export function iframe(options, children, hooks) {
  return element("iframe", options, children, hooks);
}

/**
 * @type {Element}
 */
export function img(options, children, hooks) {
  return element("img", options, children, hooks);
}

/**
 * @type {Element}
 */
export function input(options, children, hooks) {
  return element("input", options, children, hooks);
}

/**
 * @type {Element}
 */
export function ins(options, children, hooks) {
  return element("ins", options, children, hooks);
}

/**
 * @type {Element}
 */
export function kbd(options, children, hooks) {
  return element("kbd", options, children, hooks);
}

/**
 * @type {Element}
 */
export function label(options, children, hooks) {
  return element("label", options, children, hooks);
}

/**
 * @type {Element}
 */
export function legend(options, children, hooks) {
  return element("legend", options, children, hooks);
}

/**
 * @type {Element}
 */
export function li(options, children, hooks) {
  return element("li", options, children, hooks);
}

/**
 * @type {Element}
 */
export function link(options, children, hooks) {
  return element("link", options, children, hooks);
}

/**
 * @type {Element}
 */
export function main(options, children, hooks) {
  return element("main", options, children, hooks);
}

/**
 * @type {Element}
 */
export function map(options, children, hooks) {
  return element("map", options, children, hooks);
}

/**
 * @type {Element}
 */
export function mark(options, children, hooks) {
  return element("mark", options, children, hooks);
}

/**
 * @type {Element}
 */
export function meta(options, children, hooks) {
  return element("meta", options, children, hooks);
}

/**
 * @type {Element}
 */
export function meter(options, children, hooks) {
  return element("meter", options, children, hooks);
}

/**
 * @type {Element}
 */
export function nav(options, children, hooks) {
  return element("nav", options, children, hooks);
}

/**
 * @type {Element}
 */
export function noscript(options, children, hooks) {
  return element("noscript", options, children, hooks);
}

/**
 * @type {Element}
 */
export function object(options, children, hooks) {
  return element("object", options, children, hooks);
}

/**
 * @type {Element}
 */
export function ol(options, children, hooks) {
  return element("ol", options, children, hooks);
}

/**
 * @type {Element}
 */
export function optgroup(options, children, hooks) {
  return element("optgroup", options, children, hooks);
}

/**
 * @type {Element}
 */
export function option(options, children, hooks) {
  return element("option", options, children, hooks);
}

/**
 * @type {Element}
 */
export function output(options, children, hooks) {
  return element("output", options, children, hooks);
}

/**
 * @type {Element}
 */
export function p(options, children, hooks) {
  return element("p", options, children, hooks);
}

/**
 * @type {Element}
 */
export function param(options, children, hooks) {
  return element("param", options, children, hooks);
}

/**
 * @type {Element}
 */
export function picture(options, children, hooks) {
  return element("picture", options, children, hooks);
}

/**
 * @type {Element}
 */
export function pre(options, children, hooks) {
  return element("pre", options, children, hooks);
}

/**
 * @type {Element}
 */
export function progress(options, children, hooks) {
  return element("progress", options, children, hooks);
}

/**
 * @type {Element}
 */
export function q(options, children, hooks) {
  return element("q", options, children, hooks);
}

/**
 * @type {Element}
 */
export function rp(options, children, hooks) {
  return element("rp", options, children, hooks);
}

/**
 * @type {Element}
 */
export function rt(options, children, hooks) {
  return element("rt", options, children, hooks);
}

/**
 * @type {Element}
 */
export function ruby(options, children, hooks) {
  return element("ruby", options, children, hooks);
}

/**
 * @type {Element}
 */
export function s(options, children, hooks) {
  return element("s", options, children, hooks);
}

/**
 * @type {Element}
 */
export function samp(options, children, hooks) {
  return element("samp", options, children, hooks);
}

/**
 * @type {Element}
 */
export function script(options, children, hooks) {
  return element("script", options, children, hooks);
}

/**
 * @type {Element}
 */
export function section(options, children, hooks) {
  return element("section", options, children, hooks);
}

/**
 * @type {Element}
 */
export function select(options, children, hooks) {
  return element("select", options, children, hooks);
}

/**
 * @type {Element}
 */
export function small(options, children, hooks) {
  return element("small", options, children, hooks);
}

/**
 * @type {Element}
 */
export function source(options, children, hooks) {
  return element("source", options, children, hooks);
}

/**
 * @type {Element}
 */
export function span(options, children, hooks) {
  return element("span", options, children, hooks);
}

/**
 * @type {Element}
 */
export function strong(options, children, hooks) {
  return element("strong", options, children, hooks);
}

/**
 * @type {Element}
 */
export function style(options, children, hooks) {
  return element("style", options, children, hooks);
}

/**
 * @type {Element}
 */
export function sub(options, children, hooks) {
  return element("sub", options, children, hooks);
}

/**
 * @type {Element}
 */
export function summary(options, children, hooks) {
  return element("summary", options, children, hooks);
}

/**
 * @type {Element}
 */
export function sup(options, children, hooks) {
  return element("sup", options, children, hooks);
}

/**
 * @type {Element}
 */
export function svg(options, children, hooks) {
  return element("svg", options, children, hooks);
}

/**
 * @type {Element}
 */
export function table(options, children, hooks) {
  return element("table", options, children, hooks);
}

/**
 * @type {Element}
 */
export function tbody(options, children, hooks) {
  return element("tbody", options, children, hooks);
}

/**
 * @type {Element}
 */
export function td(options, children, hooks) {
  return element("td", options, children, hooks);
}

/**
 * @type {Element}
 */
export function template(options, children, hooks) {
  return element("template", options, children, hooks);
}

/**
 * @type {Element}
 */
export function textarea(options, children, hooks) {
  return element("textarea", options, children, hooks);
}

/**
 * @type {Element}
 */
export function tfoot(options, children, hooks) {
  return element("tfoot", options, children, hooks);
}

/**
 * @type {Element}
 */
export function th(options, children, hooks) {
  return element("th", options, children, hooks);
}

/**
 * @type {Element}
 */
export function thead(options, children, hooks) {
  return element("thead", options, children, hooks);
}

/**
 * @type {Element}
 */
export function time(options, children, hooks) {
  return element("time", options, children, hooks);
}

/**
 * @type {Element}
 */
export function title(options, children, hooks) {
  return element("title", options, children, hooks);
}

/**
 * @type {Element}
 */
export function tr(options, children, hooks) {
  return element("tr", options, children, hooks);
}

/**
 * @type {Element}
 */
export function track(options, children, hooks) {
  return element("track", options, children, hooks);
}

/**
 * @type {Element}
 */
export function u(options, children, hooks) {
  return element("u", options, children, hooks);
}

/**
 * @type {Element}
 */
export function ul(options, children, hooks) {
  return element("ul", options, children, hooks);
}

/**
 * @type {Element}
 */
export function video(options, children, hooks) {
  return element("video", options, children, hooks);
}

/**
 * @type {Element}
 */
export function wbr(options, children, hooks) {
  return element("wbr", options, children, hooks);
}

