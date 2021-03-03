import { computed } from '@ember/object';
import { A } from '@ember/array';
import Service, { inject as service } from '@ember/service';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import { assert } from '@ember/debug';
import octanize from 'ember-cli-addon-docs/helpers/octanize';

const octanizeRouteInfo = (routeInfo) => {
  const needsTransform = routeInfo?.route?.[1]?.startsWith?.('components');

  return needsTransform ? {
    route: routeInfo.route,
    label: octanize(routeInfo.label)
  } : routeInfo;
};

export default Service.extend({
  router: service('-routing'),

  init() {
    this._super(...arguments);
    this.resetState();
  },

  resetState() {
    this.set('items', A());
  },

  // Each routeParam is [ routeName, model ] where model is optional
  routes: computed('items.[]', function() {
    return this.items.map(item => {
      let routeParams = [ item.route ];
      if (item.model) {
        routeParams.push(item.model);
      }

      return routeParams;
    });
  }),

  routeUrls: computed('routes.[]', function() {
    return this.routes.map(route => {
      return hrefTo(this.router, route);
    });
  }),

  currentRouteIndex: computed('router.router.url', 'routeUrls.[]', function() {
    if (this.get('routeUrls.length')) {
      let router = this.get('router.router');
      let currentURL = router.get('rootURL') + router.get('url');
      currentURL = currentURL.replace('//', '/')   // dedup slashes
      let longestIndex, longestPrefix;
      this.routeUrls.forEach((url, index) => {
        if (currentURL.indexOf(url) === 0 && (!longestPrefix || url.length > longestPrefix.length)) {
          longestIndex = index;
          longestPrefix = url;
        }
      });
      assert(`DocsRoutes wasn't able to correctly detect the current route. The current url is ${currentURL}`, longestIndex != null);
      return longestIndex;
    }
  }),

  next: computed('currentRouteIndex', 'items', 'routes.[]', function() {
    let currentIndex = this.currentRouteIndex;

    if (currentIndex < (this.get('routes.length') - 1)) {
      let nextRouteIndex = currentIndex + 1;
      let route = this.routes[(nextRouteIndex)];

      return octanizeRouteInfo({
        route,
        label: this.items.objectAt(nextRouteIndex).get('label')
      });
    }
  }),

  previous: computed('currentRouteIndex', 'items', 'routes.[]', function() {
    let currentIndex = this.currentRouteIndex;

    if (currentIndex > 0) {
      let previousRouteIndex = currentIndex - 1;
      let route = this.routes[(previousRouteIndex)];

      return octanizeRouteInfo({
        route,
        label: this.items.objectAt(previousRouteIndex).get('label')
      });
    }
  })

});
