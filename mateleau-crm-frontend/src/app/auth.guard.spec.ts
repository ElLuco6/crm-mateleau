// auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, UrlSegment } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard (CanMatchFn)', () => {
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }],
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  function runGuard(segments: UrlSegment[] = []) {
    // Exécute le guard dans un contexte d'injection valide
    return TestBed.runInInjectionContext(() => AuthGuard({} as any, segments));
  }

  it('should allow access when token exists', () => {
    localStorage.setItem('token', 'fake-token');

    const result = runGuard([new UrlSegment('dashboard', {})]);

    expect(result).toBeTrue();
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  it('should return UrlTree(/login?r=/dashboard) when token is missing', () => {
    const fakeTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(fakeTree);

    const result = runGuard([new UrlSegment('dashboard', {})]);

    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { r: '/dashboard' } }
    );
    expect(result).toBe(fakeTree);
  });

  it('should handle empty segments (redirect with r=/)', () => {
    const fakeTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(fakeTree);

    const result = runGuard([]);

    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { r: '/' } }
    );
    expect(result).toBe(fakeTree);
  });
});
