# aoraki-market-dev
Aoraki website using HUGO framework and using "vux-hugo" theme.

This is Aoraki dev repository code here will automatically change the public site.

Public site link: https://megucuri.github.io/aoraki-market.github.io/


## Deploy HUGO to Github Pages using Github Action

Github comes with Jekyll. So to ignore it we add a empty file named “.nojekyll” in the root directory.

**Change "baseURL" in the config.toml**

### Create 2 repositories
1. siteName-dev (private)
2. public-site (public)

Then add public-site url to config.toml.

### Add workflow 
Actions Github Pages
https://github.com/peaceiris/actions-gh-pages

Review Dog - Action Language Tool
https://github.com/reviewdog/action-languagetool

Dependabot
https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-use-the-latest-and-specific-release

Create ".github" folder in root folder and create "dependabot.yml" in it.
```
// dependabot.yml - This will update dependencies automatically.
version: 2
updates:
- package-ecosystem: "github-actions"
  directory: "/"
  schedule:
    interval: "daily"
  labels:
  - "CI/CD"
  commit-message:
    prefix: ci
```

Then, in ".github" and create "workflows" folder with "gh-pages.yml" and "reviewdog.yml" in it.
```
// gh-pages.yml - When the siteName-dev (private) repository changes this workflow will automatically deploy it to the public repository.

name: github pages

on:
  push:
    branches:
      - main  # Set a branch to deploy
  # pull_request:

jobs:
  deploy:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true  # Fetch Hugo themes (true OR recursive)
          fetch-depth: 0    # Fetch all history for .GitInfo and .Lastmod

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          # extended: true

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          # Comment out the "github_token"
          # github_token: ${{ secrets.GITHUB_TOKEN }} 
          # Adding deploy key and external repostitory. Comment out github_token because we are deploying to a public repository.
          
          # Need to get key for ${{ secrets.ACTIONS_DEPLOY_KEY }} But don't need to change anything for the "deply_key"
          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }} 
          
          #Change username/siteName-dev.github.io
          external_repository: USERNAME HERE/SITENAME-DEV.GITHUB.IO HERE
          
          # changed name of branch. default: gh-pages
          publish_branch: main 
          publish_dir: ./public
          
          # Added name and email
          user_name: 'ADD USER NAME HERE'
          user_email: 'ADD EMAIL HERE'
          
// reviewdog.yml - To review if code and syntax is right.
name: reviewdog
on: [pull_request]
jobs:
  linter_name:
    name: runner / reviewdog
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: reviewdog/action-languagetool@v1
        with:
          github_token: ${{ secrets.github_token }}
          # Change reviewdog reporter if you need [github-pr-check,github-check,github-pr-review].
          reporter: github-pr-review
          # Change reporter level if you need.
          level: info
```
Reference: https://gohugo.io/hosting-and-deployment/hosting-on-github/

### Create deploy key in terminal
```
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
The command above will make 2 keys public key and secret key.

To view the keys use the "cat" command in the terminal...
```
// public
$ cat ~/.ssh/keyName.pub

// private
$ cat ~/.ssh/keyName
```
Reference links:
https://dev.to/n3wt0n/github-deploy-keys-40k5#:~:text=To%20create%20a%20Deploy%20Key,server%20it%20is%20intended%20for.&text=This%20will%20create%20both%20the%20private%20and%20the%20public%20key.&text=Alright%2C%20now%20that%20we%20have,and%20fill%20in%20the%20form.

### Add keys to the newly created repositories
Public key in the public-site repository “deployment key” section.

Secret key in the siteName-dev repository “secret” section. Name the key "ACTIONS_DEPLOY_KEY"

### Git push
See it run!
When siteName-dev repository gets updated the public-site will also be automatically updated.

---

## Using SCSS/SASS
HUGO comes with scss/sass function so all we got to do is create a folder named "assets" in the root directory.

Then create another folder in "assets" and name it "sass" with a file called "main.scss".

```
//Add the code before to </head>

{{ $style := resources.Get "scss/main.scss" | resources.ToCSS | resources.Minify | resources.Fingerprint | postCSS }}

{{ if .Site.IsServer }} // If local
<link rel="stylesheet" href="{{ $style.Permalink }}">
{{ else }}
  {{ $styles := $styles | minify | fingerprint | resources.PostProcess }} // If public
  <link rel="stylesheet" href="{{ $styles.RelPermalink }}" integrity="{{ $styles.Data.Integrity }}"/>
{{ end }}
```
Reference links:
https://gohugo.io/hugo-pipes/introduction/#method-aliases

HUGO will automativally compile scss file to css file.

## Using JS with HUGO pipes
Create another folder in "assets" and name it "js" with a file called "index.tx".
```
// Add the code before to </body>

{{ with resources.Get "js/index.ts" }}
   {{ $js := resources.Get . | minify | js.Build }}
   <script src="{{ $js.Permalink }}"></script>
{{ end }}
```

## Adding "target_blank" to anochor
Create "_markup" folder then in it a "render-link.html" file. The path should look like this...
```
layouts/_default/_markup/render-link.html

```
Terminal command to make directories in directory
```
mkdir -p layouts/_default/_markup
```
Then in _markup folder
```
touch layouts/_default/_markup/render-link.html  
```

In the render-link.html

Add the folowing code.
```
<a href="{{ .Destination | safeURL }}"{{ with .Title}} title="{{ . }}"{{ end }}{{ if strings.HasPrefix .Destination "http" }} target="_blank" rel="noopener"{{ end }}>{{ .Text | safeHTML }}</a>

```
Any links that has "http" would automatically add a "target_link" to the markdown.

Reference links:
https://gohugo.io/getting-started/configuration-markup#link-with-title-markdown-example

https://kamoqq.info/post/hugo-render-hook-templates/

## Figure shortcode to add classes to image.
```
// In markdown. Example:
{{< figure src="images/img.jpg" title="image title" class="given-class">}}
```
https://gohugo.io/content-management/shortcodes/#figure


## Sections and 
To make new markdown folder in a directory

```
hugo new folder/file.md etc
```

To get a section.
```
{{ .Site.Sections }} 

// can also access .Title in range
{{ range .Site.Sections }}
    <h6>{{ .Title }}</h6>
{{ end }}
```

## List Page
```
// Basic structure

{{ range .Pages }}
    {{ partial "product.html" .Params }}
{{ end }}
```

To get all the pages in "section". This example uses 'products' as a section. Works espceailly well in Forestry.io

```
{{ range where .Site.RegularPages "Section" "products"}}
{{ partial "product.html" .Params }}
{{ .Permalink }}
{{ end }}
```

Reference:
https://www.youtube.com/watch?v=0GZxidrlaRM&list=PLLAZ4kZ9dFpOnyRlyS-liKL5ReHDcj4G3&index=6
https://gohugo.io/templates/lists/v

## Taxonomies
### Categories
```
// layouts/partials/all-taxonomies.html
<section>
  <ul>
    // Change .Site.Taxonomies.categories to .Site.Taxonomies.tags or .Site.Taxonomies for both.
    {{ range $taxonomy_term, $taxonomy := .Site.Taxonomies.categories }} 
      {{ with  (printf "/%s" $taxonomy_term) }}
        <li>
          {{ with $taxonomy_term }}
            <h2 href="">{{ . }}</h2>
          {{ else }}
            <h2>その他</h2>
          {{ end }}
          <ul>
            {{ range $key, $value := $taxonomy }}
              <li hugo-nav="{{ .Page.Permalink }}">
                  <a href="{{ .Page.Permalink }}">
                    {{ .LinkTitle }}
                  </a>
              </li>
            {{ end }}
          </ul>
        </li>
      {{ end }}
    {{ end }}
  </ul>
</section>
```
Rerfence:

https://discourse.gohugo.io/t/list-all-the-categories-used-in-the-blog/10211

https://gohugo.io/templates/taxonomy-templates/#render-a-sites-taxonomies


## Github Cammands
```
// Make new branch
git branch nameOfBranch

// Change branch
git checkout nameOfBranch

// To see if it changed branch
git:(nameOfBranch)

```
### vim Cammands
```
// save and close
wq
```

### To revert pull request
https://saikeblog.com/2020/03/09/github%E3%81%A7pull-request%E3%81%AE%E3%83%9E%E3%83%BC%E3%82%B8%E3%82%92%E6%89%93%E3%81%A1%E6%B6%88%E3%81%99%E6%96%B9%E6%B3%95/


