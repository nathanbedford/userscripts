// ==UserScript==
// @name         SinonJS API Fake Example
// @version      0.1
// @description  Fake an API call's response
// @author       You
// @match        https://resttesttest.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/sinon.js/11.1.2/sinon.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  // we'll do a little set up to make it easy to register the requests/responses we want to fake
  const fakeResponses = [];

  function registerFakeResponse(method, url, statusCode, body) {
    fakeResponses.push({method:method, url:url, statusCode:statusCode, body:body});
  }

  // Register your fake responses here
  // Register your fake responses here
  registerFakeResponse("GET", "https://httpbin.org/get", 200, JSON.stringify({hey:"hello"}));
  // Register your fake responses here
  // Register your fake responses here


  // Now we'll create the fake server
  window.sinonServer = window.sinon.fakeServer.create({autoRespond: true});

  // and use the filtering methods to make sure we only handle the requests we want to fake
  window.sinon.FakeXMLHttpRequest.useFilters = true;
  window.sinon.FakeXMLHttpRequest.addFilter((method, url, async, username, password) => {
    // I'm being a little verbose here to help demo what's going on
    var registeredResponse = fakeResponses.find(x => {
      return x.method === method && x.url === url;
    });

    // if this filter handler returns true, the request will not be faked
    const shouldFake = !registeredResponse;
    if (shouldFake) {
      console.warn("Faking response!", method, url, registeredResponse);
    }

    return shouldFake;
  });


  // finally, we'll configure Sinon to send our canned responses to the requests we want to fake
  fakeResponses.forEach( r => {
    window.sinonServer.respondWith(r.method, r.url, [r.statusCode, { "Content-Type": "application/json" }, r.body]);
  });

})();
