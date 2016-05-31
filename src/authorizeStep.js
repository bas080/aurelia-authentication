import {inject} from 'aurelia-dependency-injection';
import {Authentication} from './authentication';
import {Redirect} from 'aurelia-router';
import * as LogManager from 'aurelia-logging';

@inject(Authentication)
export class AuthorizeStep {
  constructor(authentication) {
    LogManager.getLogger('authentication').warn('AuthorizeStep is deprecated. Use AuthenticationStep instead and add {settings: {authenticate: true}} to your router configuration.');

    this.authentication = authentication;
  }

  run(routingContext, next) {
    const isLoggedIn = this.authentication.isAuthenticated();
    const loginRoute = this.authentication.config.loginRoute;

    if (routingContext.getAllInstructions().some(i => i.config.auth)) {
      if (!isLoggedIn) {
        return next.cancel(new Redirect(loginRoute));
      }
    } else if (isLoggedIn && routingContext.getAllInstructions().some(i => i.fragment === loginRoute)) {
      return next.cancel(new Redirect( this.authentication.config.loginRedirect ));
    }

    return next();
  }
}
