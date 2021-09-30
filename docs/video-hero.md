# Updating featured video hero

Atlas will fetch a remote `hero-info.json` file to get information on what should be displayed in the hero section on top of the home page. That JSON file is hosted on our Linode object storage, and a designated community member will receive write permissions to that storage, so they can update the content dynamically.


### Structure of the JSON file

```json
{
  "videoId": "1",
  "heroTitle": "Ghost Signals",
  "heroVideoCutUrl": "https://eu-central-1.linodeobjects.com/atlas-hero/cover-cut-ghost-signals.mp4"
}
```

- `videoId`: ID of the video uploaded to Joystream that this cover mentions
- `heroTitle`: Title that should be displayed in the cover section. In general, this should be the same as the title of the published video but may need to be shortened for some videos for the cover to look sexy
- `heroVideoCutUrl`: URL to the video file that should be playing in the background of the cover section. Usually, this will be a trimmed version of the published video. This can be hosted in the same Linode bucket as `hero-info.json`

### Changing cover info

As mentioned above, Atlas will fetch a JSON file - `https://eu-central-1.linodeobjects.com/atlas-hero/hero-info.json`. This file is hosted in Linode object storage, which is an S3-compatible storage. A designated community member will have keypair to write to that storage. To access it, you can use any S3-compatible client, some good choices are [Cyberduck](https://cyberduck.io/) (UI-based) and [s3cmd](https://s3tools.org/s3cmd-howto]).

When configuring the above tools, you may need to provide the following data:
- storage host URL - `eu-central-1.linodeobjects.com`
- storage bucket URL (for `s3cmd`) - `%(bucket).eu-central-1.linodeobjects.com`
- bucket name - `atlas-hero`
- access key - use yours
- secret key - use yours

Example of uploading a file via `s3cmd`:
```shell
s3cmd put hero-info.json s3://atlas-hero/hero-info.json
```

### Help

If you got any questions, reach out to `@kdembler` on community discord
