import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';
import octanize from 'dummy/helpers/octanize';

import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  docsRoutes: service(),

  didInsertElement() {
    this._super(...arguments);
    let model = this.model;

    if (typeof model === 'string' && model.includes('#')) {
      return;
    }

    next(() => {
      this.get('docsRoutes.items').addObject(this);
    });
  },

  formattedLabel: computed(function() {
    const needsTransform = this.model?.startsWith?.('components');
    return needsTransform ? octanize(this.label) : this.label;
  })
}).reopenClass({

  positionalParams: ['label', 'route', 'model']

});
