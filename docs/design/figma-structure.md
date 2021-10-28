# Atlas Figma Team Structure

## Quick links

1. [Viewer designs](https://www.figma.com/files/project/33106300/%F0%9F%91%A9%F0%9F%8F%BE%E2%80%8D%F0%9F%A6%B1-Viewer?fuid=730334878476004289),
2. [Publisher designs](https://www.figma.com/files/project/33106318/%F0%9F%91%A8%F0%9F%8F%BB%E2%80%8D-Publisher?fuid=730334878476004289),
3. **["Joystream Atlas" legacy file](https://www.figma.com/file/Vk2Z4QOiVa5bB6q3cBIG5J/Joystream-Atlas)**,
4. [Web Components](https://www.figma.com/file/Pf31tuYpozYmpq163U2ho8/Web-Components),
5. [Foundation](https://www.figma.com/file/Cc3VDoK6qglJ617ChA2EMr/Foundation),


## Context
![Figma Team structure](src/Figma%20Structure.png)

Because Figma is a cloud-based tool, all our design files are stored in the cloud and are organized within a structure imposed by the tool. Figma allows for up to 4 layers of organization:
```
Organization Workspace (Org tier only) → Teams → Projects → Files → Pages
```

As an Atlas Design Team, we use Figma in the [Professional tier](https://www.figma.com/pricing/), which allows us to operate within **one Team**, have an **unlimited number of Projects** with an **unlimited number of Files** inside.

## Structure overview

![Figma Atlas Team structure](src/Figma%20Atlas%20Structure.png)
![Figma Atlas screenshot](src/Figma%20Screenshot.png)
_💡 Tip: You can pin Projects to your sidebar in Figma, by clicking on the star next to the Project card. Pinned Projects can be rearranged._

<!-- <style>
.caption {
  font-size: .9em;
  color: gray;
}
</style>
 -->
<table>
<thead>
  <tr>
    <th width=100>Team</th>
    <th width=500>Projects</th>
    <th width=500>Files</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td rowspan="12"><strong>Atlas<strong></td>
    <td rowspan="4">
      <a href="https://www.figma.com/files/project/33106243/%F0%9F%8E%A8-Design-System?fuid=730334878476004289" target="_blank"><strong>🎨 Design System</strong></a>
      <br>
      <span class="caption">Contains libraries Figma files and other design resources</span>
    </td>
    <td>
      <a href="https://www.figma.com/file/Cc3VDoK6qglJ617ChA2EMr/Foundation" target="_blank"><strong>📄 Foundation</strong></a>
      <br>
      <span class="caption">Library of Atlas design tokens</span>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.figma.com/file/Pf31tuYpozYmpq163U2ho8/Web-Components" target="_blank"><strong>📄 Web Components</strong></a>
      <br>
      <span class="caption">Library of Atlas design web components</span>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.figma.com/file/2tlBY1JQtRMoyjmjJQ9jam/Icons" target="_blank"><strong>📄 Icons</strong></a>
      <br>
      <span class="caption">Library of Atlas icons</span>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.figma.com/file/yjuGz1asfGbifsCIOVUoPn/Utilities" target="_blank"><strong>📄 Figma Utilities</strong></a>
      <br>
      <span class="caption">Library of utility Figma components used to document our designs</span>
    </td>
  </tr>
  <tr>
    <td rowspan="3">
      <a href="https://www.figma.com/files/project/33106300/%F0%9F%91%A9%F0%9F%8F%BE%E2%80%8D%F0%9F%A6%B1-Viewer?fuid=730334878476004289" target="_blank"><strong>👩🏾‍🦱 Viewer</strong></a>
      <br>
      <span class="caption">Designs, prototypes and flows for the Viewer experience</span>
    </td>
    <td>
      <a href="https://www.figma.com/file/2tlBY1JQtRMoyjmjJQ9jam/Icons" target="_blank"><strong>📄 [Preview] All viewer pages</strong></a>
      <br>
      <span class="caption">Preview of all Viewer pages for a quick and easy access</span>
    </td>
  </tr>
  <tr>
    <td>
      <strong><i>[Page] Page name 1, [Page] Page 2...</i></strong>
      <br><br>
      <span class="caption">For each page in the Viewer experience, there should be a separate Figma file with designs for the page itself, RWD and other design explorations. These files should be kept up-to-date. <br><br><strong>Because user flows can spread through multiple pages, please note these files do not include flows and prototypes</strong> (see below).</span>
    </td>
  </tr>
  <tr>
    <td>
      <strong><i>[#1] Sprint name 1, [#2] Sprint name 2...</i></strong>
      <br><br>
      <span class="caption">For each GitHub design sprint related to the Viewer experience, there should be a separate Figma file with flows and interactive prototypes.<br><br><strong>Please note, that numbers in square brackets should reference GitHub sprint numbers (in urls).</span>
    </td>
  </tr>
  <tr>
    <td rowspan="3">
      <a href="https://www.figma.com/files/project/33106318/%F0%9F%91%A8%F0%9F%8F%BB%E2%80%8D-Publisher?fuid=730334878476004289" target="_blank"><strong>👨🏻‍ Publisher</strong></a>
      <br>
      <span class="caption">Designs, prototypes and flows for the Publisher experience</span>
    </td>
    <td>
      <a href="https://www.figma.com/file/RBAsRLWmOCm65Tdt9dOsPJ/Preview-All-publisher-pages" target="_blank"><strong>📄 [Preview] All publisher pages</strong></a>
      <br>
      <span class="caption">Preview of all Publisher pages for a quick and easy access</span>
    </td>
  </tr>
  <tr>
    <td>
    <strong><i>[Page] Page name 1, [Page] Page 2...</i></strong>
    <br><br>
    <span class="caption">For each page in the Viewer experience, there should be a separate Figma file with designs for the page itself, RWD and other design explorations. These files should be kept up-to-date. <br><br><strong>Because user flows can spread through multiple pages, please note these files do not include flows and prototypes</strong> (see below).</span>
    </td>
  </tr>
  <tr>
    <td>
    <strong><i>[#1] Sprint name 1, [#2] Sprint name 2...</i></strong>
    <br><br>
    <span class="caption">For each GitHub design sprint related to the Viewer experience, there should be a separate Figma file with flows and interactive prototypes.<br><br><strong>Please note, that numbers in square brackets should reference GitHub sprint numbers (in urls).</span>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.figma.com/files/project/33106822/%F0%9F%8F%97-Temp-Workspace?fuid=730334878476004289" target="_blank"><strong>🏗 Temp Workspace</strong></a>
      <br>
      <span class="caption">Irrelevant Figma files, explorations, experimentations, etc.</span>
    </td>
    <td>
      <a href="https://www.figma.com/file/Vk2Z4QOiVa5bB6q3cBIG5J/Joystream-Atlas" target="_blank"><strong>📄 Joystream Atlas</strong></a>
      <br>
      <span class="caption">A soon-to-be-deprecated Figma file containing designs from the "pre Figma Team era", when everything used to be kept within a single file</span>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.figma.com/files/project/33712705/%F0%9F%9B%A0-Pioneer-(Tweaks)?fuid=730334878476004289" target="_blank"><strong>🛠 Pioneer (Tweaks)</strong></a>
      <br>
      <span class="caption">Loosely organized space for Figma files with designs for simple Pioneer tweaks</span>
    </td>
    <td></td>
  </tr>
</tbody>
</table>
