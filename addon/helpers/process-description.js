import Helper from '@ember/component/helper';
import { getOwner } from '@ember/application';

const rawLink = '{{docs-link $1 $2(?: $3)?}}';
const quotedValue = '&#39;([^&#39;]*?)&#39;';
const anyWhitespace = '\\s+';
const formattedLink = rawLink.replace(/ /g, anyWhitespace).replace(/\$\d/g, quotedValue);
const lookupLinks = new RegExp(formattedLink, 'g');
const formatHref = (href, model) => {
  if (!model?.startsWith?.('utils')) {
    return href;
  }

  return `/docs/api/modules/ember-smile/${model}`;
};

export default class ProcessDescriptionHelper extends Helper {
  compute([description]) {
    return description?.replace(lookupLinks, this._replaceLink.bind(this));
  }

  /**
    Callback that is used to replace {{docs-link}} links with anchor tags.

    @method _replaceLink
    @private
    @param {String} _     match
    @param {String} label text content of the link
    @param {String} route target route
    @param {String} model model parameter for route
    @return {String} a rendered {{docs-link}} element
  */
  _replaceLink(_, label, route, model) {
    const LinkToComponent = getOwner(this).factoryFor('component:link-to');
    const { href } = LinkToComponent.create({ route, model });
    const url = (href === '#') ? `/docs/${route}` : formatHref(href, model);
    const formattedLabel = label.replace('<', '&lt;').replace('>', '&gt;');

    return `<a href="${url}">${formattedLabel}</a>`;
  }
}
