## Contributing

First off, thank you for considering contributing to explore-user-model . It's people
like you that make it such a great tool.

### Where do I go from here?

If you've noticed a bug or have a question that doesn't belong on the
[Stack Overflow][], [search the issue tracker][] to see if
someone else in the community has already created a ticket. If not, go ahead and
[make one][new issue]!

### Fork & create a branch

If this is something you think you can fix, then [fork express-user-model][] and
create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-some-features
```

### Get the test suite running


Install the development dependencies:

```sh
npm install
```

Now you should be able to run the entire suite using:

```sh
make test
```


If your tests are passing locally but they're failing on TravisCI, it's probably
because of some breaking change or problem with the latest version of some
dependency. You should be able to reproduce the issue locally by:

* Removing the `package.json.lock` file.
* Running `npm install`.
* Re-running the tests again like you did previously.

This is not your fault though, so if this happens feel free to investigate, but
also feel free to ping maintainers about the issue you just found.



### Did you find a bug?

* **Ensure the bug was not already reported** by [searching all issues][].

* If you're unable to find an open issue addressing the problem,
  [open a new one][new issue]. Be sure to include a **title and clear
  description**, as much relevant information as possible, and a **code sample**
  or an **executable test case** demonstrating the expected behavior that is not
  occurring.

### 5. Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help;
everyone is a beginner at first :smile_cat:

### 6. View your changes in a express application

express-user-model is meant to be used by humans, not cucumbers. So make sure to take
a look at your changes in an app.

### Get the style right

Your patch should follow the same conventions & pass the same code quality
checks as the rest of the project. `jshint` will give you feedback in
this regard. You can check & fix style issues.

### Make a Pull Request

At this point, you should switch back to your master branch and make sure it's
up to date with express user model's master branch:

```sh
git remote add upstream git@github.com:amritghimire/express-user-model.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-some-features
git rebase master
git push --set-upstream origin 325-add-some-features
```

Finally, go to GitHub and [make a Pull Request][] :D

TravisCI will run our test suite against all supported node versions. We care
about quality, so your PR won't be merged until all tests pass. It's unlikely,
but it's possible that your changes pass tests in one node version but fail in
another. In that case, you'll have to setup your development environment to use
the problematic node version, and investigate what's going on!

### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code
has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of [good][git rebasing]
[resources][interactive rebase] but here's the suggested workflow:

```sh
git checkout 325-add-some-features
git pull --rebase upstream master
git push --force-with-lease 325-add-some-features
```

### Merging a PR (maintainers only)

A PR can only be merged into master by a maintainer if:

* It is passing CI.
* It has been approved by at least two maintainers. If it was a maintainer who
  opened the PR, only one extra approval is needed.
* It has no requested changes.
* It is up to date with current master.

Any maintainer is allowed to merge a PR if all of these conditions are
met.

### Shipping a release (maintainers only)

Maintainers need to do the following to push out a release:

* Make sure all pull requests are in and that changelog is current
* Update `package.json` file and changelog with new version number

[Stack Overflow]: http://stackoverflow.com/questions/tagged/express-user-model
[search the issue tracker]: https://github.com/amritghimire/express-user-model/issues?q=something
[new issue]: https://github.com/activeadmin/express-user-model/issues/new
[fork express-user-model]: https://help.github.com/articles/fork-a-repo
[searching all issues]: https://github.com/amritghimire/express-user-model/issues/?q=
[make a pull request]: https://help.github.com/articles/creating-a-pull-request
[git rebasing]: http://git-scm.com/book/en/Git-Branching-Rebasing
[interactive rebase]: https://help.github.com/articles/interactive-rebase
