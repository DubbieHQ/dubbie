dub dub dubbbbb!!!

still working on this README
dubbie.com for more info

join discord [here](https://discord.gg/qJNV93PY2e)

the project is usable with a few known bugs and concerns
1. sometimes there's a race condition that occurs when regenerating audio and moving segment that causes next app to crash
2. sometimes regenerated audio does not immediately sound good in preview
3. sometimes demucs(background audio extraction) crashes
4. backend is not scalable, and does not have a queue rn, so if too many people initializes then it'll likely go OOM.
