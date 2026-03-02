## Agent info

Generally speaking, you should browse the codebase to figure out what is going on.

We have a few "philosophies" I want to make sure we honor throughout development:

### 1. Performance above all else

When in doubt, do the thing that makes the app feel the fastest to use.

This includes things like

- Optimistic updates
- Using the custom data loader patterns and custom link components with prewarm on hover
- Avoiding waterfalls in anything from js to file fetching

### 2. Good defaults

Users should expect things to behave well by default. Less config is best.

### 3. Convenience

We should not compromise on simplicity and good ux. We want to be pleasant to use with as little friction as possible. This means things like:

- All links are "share" links by default
- Minimize blocking states to let users get into app asap

### 4. Security

We want to make things convenient, but we don't want to be insecure. Be thoughtful about how things are implemented. Check team status and user status before committing changes. Be VERY thoughtful about endpoints exposed "publicly". Use auth and auth checks where they make sense to.

### 5. Testing

All code that has logic must be tested. Every feature must have at least one E2E test. Every integration must have at least one integration test. Every behavior must have at least one behavior test. When writing tests, always test from the outside in and assume nothing of the code under test. That means things like:

- no `.toBeInvoked()`
- no `spyOn()`
- no reliance on internal method names/logger matches (you should only be able to use public APIs to test)

If code is not well testable, it must be refactored to become testable.

### 6. Zero-Skip Policy

**Never leave the codebase in a failing state.** When any quality fails during or after your work, fix all failures before marking the task complete. This applies regardless of whether the failure was introduced by your changes or pre-existed. The codebase must be green when you're done.

If commit fails due to pre-commit hooks, fix the issues before retrying the commit.
