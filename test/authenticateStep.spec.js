import {Container} from 'aurelia-dependency-injection';

import {AuthenticateStep} from '../src/authenticateStep';


const routes = {
  onLoginRoute : [
    {name: 'parent', fragment: '/login', config: {settings: {}}},
    {name: 'child', fragment: 'childUrl', config: {settings: {}}}
  ],
  authenticateNone : [
    {name: 'parent', fragment: 'parentUrl', config: {settings: {}}},
    {name: 'child', fragment: 'childUrl', config: {settings: {}}}
  ],
  authenticateChild : [
    {name: 'parent', fragment: 'parentUrl', config: {settings: {}}},
    {name: 'child', fragment: 'childUrl', config: {settings: {authenticate: true}}}
  ],
  authenticateParent : [
    {name: 'parent', fragment: 'parentUrl', config: {settings: {authenticate: true}}},
    {name: 'child', fragment: 'childUrl', config: {settings: {}}}
  ]};

describe('AuthenticateStep', () => {
  describe('.run()', () => {
    const authenticateStep = new Container().get(AuthenticateStep);
    function next() {return;}
    let loginRoute = authenticateStep.authentication.config.loginRoute;

    it('should not redirect when not authenticated and no route requires it', () => {
      let routingContext = {
        getAllInstructions: () => routes.authenticateNone
      };

      next.cancel = redirect => {throw new Error();};

      spyOn(next, 'cancel');

      authenticateStep.run(routingContext, next);

      expect(next.cancel).not.toHaveBeenCalled();
    });

    it('should redirect to login when not authenticated and child route requires it', done => {
      let routingContext = {
        getAllInstructions: () => routes.authenticateChild
      };

      next.cancel = redirect => {
        expect(redirect.url).toBe(loginRoute);
        done();
      };

      authenticateStep.run(routingContext, next);
    });

    it('should redirect to login when not authenticated and parent route requires it', done => {
      let routingContext = {
        getAllInstructions: () => routes.authenticateParent
      };

      next.cancel = redirect => {
        expect(redirect.url).toBe(loginRoute);
        done();
      };

      authenticateStep.run(routingContext, next);
    });

    it('should not redirect to login when authenticated and no route requires it', () => {
      let routingContext = {
        getAllInstructions: () => routes.authenticateNone
      };

      next.cancel = redirect => {throw new Error();};

      spyOn(next, 'cancel');

      authenticateStep.authentication.isAuthenticated = () => true;

      authenticateStep.run(routingContext, next);

      expect(next.cancel).not.toHaveBeenCalled();
    });

    it('should not redirect when authenticated and child route requires it', ()  => {
      let routingContext = {
        getAllInstructions: () => routes.authenticateChild
      };

      next.cancel = redirect => {throw new Error();};

      spyOn(next, 'cancel');

      authenticateStep.authentication.isAuthenticated = () => true;

      authenticateStep.run(routingContext, next);

      expect(next.cancel).not.toHaveBeenCalled();
    });

    it('should not redirect when not authenticated and parent route requires it', () => {
      let routingContext = {
        getAllInstructions: () => routes.authenticateParent
      };

      next.cancel = redirect => {throw new Error();};

      spyOn(next, 'cancel');

      authenticateStep.authentication.isAuthenticated = () => true;

      authenticateStep.run(routingContext, next);

      expect(next.cancel).not.toHaveBeenCalled();
    });

    it('should redirect when  authenticated and parent route is login route', done => {
      let routingContext = {
        getAllInstructions: () => routes.onLoginRoute
      };

      next.cancel = redirect => {
        expect(redirect.url).toBe(authenticateStep.authentication.config.loginRedirect);
        done();
      };

      authenticateStep.authentication.isAuthenticated = () => true;

      authenticateStep.run(routingContext, next);
    });
  });
});
