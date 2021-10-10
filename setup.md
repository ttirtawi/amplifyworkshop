# Contribute to existing Mkdocs documentation

To start contributing on existing mkdocs documentation project, please run the following:

```
apt-get install python3 python3-pip ## This is optional if you already have Python installation in your environment
apt-get install mkdocs
pip3 install mkdocs-material
git clone https://github.com/ttirtawi/amplifyworkshop.git
cd amplifyworkshop
```

You can start creating new content as Markdown document (`*.md`). All contents located under `docs` folder.

After finished add new contents, you can build the site locally using: `mkdocs build`. It will generate the page locally under `site` folder. You can test by openning `site/index.html` in your browser.

To publish the site to github.io, you can use command: `mkdocs gh-deploy`. It will rebuild the site, upload the result to Github branch (named `gh-pages`). It might takes couple minutes to the new changes to be available, try access your github.io page after that. 

One you publish new revision to github.io pages, you must also commit your changes to the main branch so that other contributor can recognize your new contribution.

Everytime you want to publish something new or modify existing content (that is not belong to you), don't forget to run `git pull` to refresh your local copy. This is to avoid conflict during your next commit activity.
