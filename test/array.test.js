const sinon = require('sinon');
const $ = require('jquery');
const Interactor = require('../src');

describe('interactor', function () {
  before(function () {
    console.log('this called in before all');
  });
  beforeEach(function () {
    console.log('invoke before each method');
  });

  afterEach(function () {
    console.log('invoke after each method');
  });
  after(function () {
    console.log('this called in after all');
  });

  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      debugger
      var interactions = new Interactor({
        interactions: true,
        interactionElement: 'interaction',
        interactionEvents: ['mousedown', 'mouseup', 'touchstart', 'touchend'],
        conversions: true,
        conversionElement: 'conversion',
        conversionEvents: ['mouseup', 'touchend'],
        endpoint: '/usage/interactions',
        async: true,
        debug: true
      });
      interactions.session.page.should.is.not.empty();
    });
    it('should have called alert function', function () {
      var _savedAlert = window.alert;

      try {
        var spy = sinon.spy(window, 'alert');
        $('#thingy').trigger('click');
        sinon.assert.called(spy);
       }

      finally { window.alert = _savedAlert; }
    });
  });
});
