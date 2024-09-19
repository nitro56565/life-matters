# LIFE MATTERS Contribution Guide
Thank you for your interest in contributing to the Life Matters project! Your contributions can help save lives by improving the efficiency of ambulance services in traffic. Here are the guidelines we’d like you to follow:

* [Code of Conduct](#coc)
* [Questions and Problems](#question)
* [Issues and Bugs](#issue)
* [Feature Requests](#feature)
* [Improving Documentation](#docs)
* [Issue Submission Guidelines](#submit)
* [Pull Request Submission Guidelines](#submit-pr)

## <a name="coc"></a> Code of Conduct

Help us keep the Life Matters community open and inclusive. Please read and follow our [Code of Conduct](#coc).

### <a name="question"></a> Got a Question or Problem?

For general support questions, please check our documentation or feel free to reach out through our community channels. GitHub Issues should be reserved for bug reports and feature requests.

### <a name="issue"></a> Found an Issue or Bug?

If you encounter a bug, please submit an issue in the GitHub repository. If you can, provide a Pull Request with your fix to help us resolve it quicker!

*Refer to the [Submission Guidelines](#submit) below.*

### <a name="feature"></a> Missing a Feature?

If you’d like to request a new feature, please open an issue detailing your suggestion. For implementing features:

* *Major Changes* should be discussed in a GitHub Issue beforehand to outline benefits and implementation details.
* *Minor Changes* can be submitted directly as a Pull Request.

### <a name="docs"></a> Want a Doc Fix?

To suggest improvements to the documentation, open an issue or submit a Pull Request with your changes. Collaboration is encouraged to avoid duplication of efforts.

## <a name="submit"></a> Issue Submission Guidelines

Before submitting an issue, please search the existing issues to see if your question or problem has already been reported. When opening a new issue, provide as much detail as possible, including steps to reproduce the bug, expected behavior, and actual behavior.

*Remember to help others if you can!*

## <a name="submit-pr"></a> Pull Request Submission Guidelines

Before submitting your Pull Request, consider the following:

1. Check for open Issues related to your changes and reference them in your Pull Request.
2. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
3. Make your changes, ensuring you include appropriate test cases.
4. Follow our Coding Guidelines for consistent code style.
5. Commit your changes with a descriptive message and ensure it verifies :
   ```bash
   git commit -s -m "Brief description of changes"
6. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
7. Create a Pull Request to merge into the main branch.After your pull request is merged
8. After your pull request is merged, you can safely delete your branch and pull the changes from the main (`upstream`) repository:
* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```bash
    git push origin --delete name/issue-tracker/short-description
  
* Check out the master branch:

  ```bash
    git checkout master -f

* Delete the local branch:

  ```bash
    git branch -D name/issue-tracker/short-description

* Update your master with the latest upstream version:

  ```bash
    git checkout master
    git fetch --all --prune
    git rebase upstream/master
    git push origin master

Thank you for contributing to Life Matters! Together, we can make a difference.

[contribute.coc]: CONTRIBUTING.md#coc
[contribute.requests]: CONTRIBUTING.md#requests
[contribute.question]: CONTRIBUTING.md#question
[contribute.issue]: CONTRIBUTING.md#issue
[contribute.feature]: CONTRIBUTING.md#feature
[contribute.docs]: CONTRIBUTING.md#docs
[contribute.updating]: CONTRIBUTING.md#updating
[contribute.submit]: CONTRIBUTING.md#submit
[contribute.submitpr]: CONTRIBUTING.md#submit-pr
[dcohow]: https://github.com/probot/dco#how-it-works
