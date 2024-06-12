import { element } from "./element.mjs";
import { atom, reactive } from "atomi";

/**
 * Inteded use is to render lazy render content once the condition is fulfilled;
 * @param {fn => boolean} condition
 * @param {Any}           context
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

export function a(options, children) {
  return element("a", options, children);
}
export function abbr(options, children) {
  return element("abbr", options, children);
}
export function address(options, children) {
  return element("address", options, children);
}
export function area(options, children) {
  return element("area", options, children);
}
export function article(options, children) {
  return element("article", options, children);
}
export function audio(options, children) {
  return element("audio", options, children);
}
export function b(options, children) {
  return element("b", options, children);
}
export function base(options, children) {
  return element("base", options, children);
}
export function bdi(options, children) {
  return element("bdi", options, children);
}
export function bdo(options, children) {
  return element("bdo", options, children);
}
export function blockquote(options, children) {
  return element("blockquote", options, children);
}
export function body(options, children) {
  return element("body", options, children);
}
export function br(options, children) {
  return element("br", options, children);
}
export function button(options, children) {
  return element("button", options, children);
}
export function canvas(options, children) {
  return element("canvas", options, children);
}
export function caption(options, children) {
  return element("caption", options, children);
}
export function cite(options, children) {
  return element("cite", options, children);
}
export function code(options, children) {
  return element("code", options, children);
}
export function col(options, children) {
  return element("col", options, children);
}
export function colgroup(options, children) {
  return element("colgroup", options, children);
}
export function data(options, children) {
  return element("data", options, children);
}
export function datalist(options, children) {
  return element("datalist", options, children);
}
export function dd(options, children) {
  return element("dd", options, children);
}
export function del(options, children) {
  return element("del", options, children);
}
export function details(options, children) {
  return element("details", options, children);
}
export function dfn(options, children) {
  return element("dfn", options, children);
}
export function dialog(options, children) {
  return element("dialog", options, children);
}
export function div(options, children) {
  return element("div", options, children);
}
export function dl(options, children) {
  return element("dl", options, children);
}
export function dt(options, children) {
  return element("dt", options, children);
}
export function em(options, children) {
  return element("em", options, children);
}
export function dmbed(options, children) {
  return element("dmbed", options, children);
}
export function fieldset(options, children) {
  return element("fieldset", options, children);
}
export function figcaption(options, children) {
  return element("figcaption", options, children);
}
export function figure(options, children) {
  return element("figure", options, children);
}
export function footer(options, children) {
  return element("footer", options, children);
}
export function form(options, children) {
  return element("form", options, children);
}
export function h1(options, children) {
  return element("h1", options, children);
}
export function h2(options, children) {
  return element("h2", options, children);
}
export function h3(options, children) {
  return element("h3", options, children);
}
export function h4(options, children) {
  return element("h4", options, children);
}
export function h5(options, children) {
  return element("h5", options, children);
}
export function h6(options, children) {
  return element("h6", options, children);
}
export function head(options, children) {
  return element("head", options, children);
}
export function header(options, children) {
  return element("header", options, children);
}
export function hr(options, children) {
  return element("hr", options, children);
}
export function html(options, children) {
  return element("html", options, children);
}
export function i(options, children) {
  return element("i", options, children);
}
export function iframe(options, children) {
  return element("iframe", options, children);
}
export function img(options, children) {
  return element("img", options, children);
}
export function input(options, children) {
  return element("input", options, children);
}
export function ins(options, children) {
  return element("ins", options, children);
}
export function kbd(options, children) {
  return element("kbd", options, children);
}
export function label(options, children) {
  return element("label", options, children);
}
export function legend(options, children) {
  return element("legend", options, children);
}
export function li(options, children) {
  return element("li", options, children);
}
export function link(options, children) {
  return element("link", options, children);
}
export function main(options, children) {
  return element("main", options, children);
}
export function map(options, children) {
  return element("map", options, children);
}
export function mark(options, children) {
  return element("mark", options, children);
}
export function meta(options, children) {
  return element("meta", options, children);
}
export function meter(options, children) {
  return element("meter", options, children);
}
export function nav(options, children) {
  return element("nav", options, children);
}
export function noscript(options, children) {
  return element("noscript", options, children);
}
export function object(options, children) {
  return element("object", options, children);
}
export function ol(options, children) {
  return element("ol", options, children);
}
export function optgroup(options, children) {
  return element("optgroup", options, children);
}
export function option(options, children) {
  return element("option", options, children);
}
export function output(options, children) {
  return element("output", options, children);
}
export function p(options, children) {
  return element("p", options, children);
}
export function param(options, children) {
  return element("param", options, children);
}
export function picture(options, children) {
  return element("picture", options, children);
}
export function pre(options, children) {
  return element("pre", options, children);
}
export function progress(options, children) {
  return element("progress", options, children);
}
export function q(options, children) {
  return element("q", options, children);
}
export function rp(options, children) {
  return element("rp", options, children);
}
export function rt(options, children) {
  return element("rt", options, children);
}
export function ruby(options, children) {
  return element("ruby", options, children);
}
export function s(options, children) {
  return element("s", options, children);
}
export function samp(options, children) {
  return element("samp", options, children);
}
export function script(options, children) {
  return element("script", options, children);
}
export function section(options, children) {
  return element("section", options, children);
}
export function select(options, children) {
  return element("select", options, children);
}
export function small(options, children) {
  return element("small", options, children);
}
export function source(options, children) {
  return element("source", options, children);
}
export function span(options, children) {
  return element("span", options, children);
}
export function strong(options, children) {
  return element("strong", options, children);
}
export function style(options, children) {
  return element("style", options, children);
}
export function sub(options, children) {
  return element("sub", options, children);
}
export function summary(options, children) {
  return element("summary", options, children);
}
export function sup(options, children) {
  return element("sup", options, children);
}
export function svg(options, children) {
  return element("svg", options, children);
}
export function table(options, children) {
  return element("table", options, children);
}
export function tbody(options, children) {
  return element("tbody", options, children);
}
export function td(options, children) {
  return element("td", options, children);
}
export function template(options, children) {
  return element("template", options, children);
}
export function textarea(options, children) {
  return element("textarea", options, children);
}
export function tfoot(options, children) {
  return element("tfoot", options, children);
}
export function th(options, children) {
  return element("th", options, children);
}
export function thead(options, children) {
  return element("thead", options, children);
}
export function time(options, children) {
  return element("time", options, children);
}
export function title(options, children) {
  return element("title", options, children);
}
export function tr(options, children) {
  return element("tr", options, children);
}
export function track(options, children) {
  return element("track", options, children);
}
export function u(options, children) {
  return element("u", options, children);
}
export function ul(options, children) {
  return element("ul", options, children);
}
export function video(options, children) {
  return element("video", options, children);
}
export function wbr(options, children) {
  return element("wbr", options, children);
}

