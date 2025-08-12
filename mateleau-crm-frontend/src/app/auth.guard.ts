import { inject, Injectable } from '@angular/core';
import { CanActivate, CanMatchFn, Router, UrlSegment } from '@angular/router';


export const AuthGuard: CanMatchFn = (_route, segments: UrlSegment[]) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) return true;

  const target = '/' + segments.map(s => s.path).join('/');
  return router.createUrlTree(['/login'], { queryParams: { r: target } });
};
