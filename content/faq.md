# FAQ: Questions we hear before we start

Straight answers to the questions procurement, platform leads and engineering directors actually ask us on the first call.

## In what model do you sell this? Body leasing?

Fixed-scope Professional Services. Small teams of staff engineers committed to a concrete outcome, not time-and-materials per head. We are not a body-leasing shop: we do not place juniors under your PM and call it delivery.

## How much time does my team need to commit?

It varies by engagement, and we scope it with you up front. As a rule of thumb: Phase 1 is a light touch from a few of your people (tech lead, SRE, security). Phase 2 asks for an engineer on your side as an embedded partner, with the rest of the team async. By Phase 3 the roles flip, your platform team drives, we assist on request.

## What is the typical ROI and when do we see it?

First signal usually lands six to eight weeks in, once the pilot team is shipping on the new setup. Full-rollout ROI tends to surface at six to nine months. We do not ship a ROI calculator, we measure cycle time, PR merge time and build time before the pilot and again after, and the report is part of the engagement.

## What technologies do you support?

Our deepest experience is in the JVM world: Scala, Kotlin, Java, Bazel, sbt, Gradle. Most of the platform components are tech-agnostic and have been deployed against Python, TypeScript and Go stacks as well. If your stack is unusual, ask, we will tell you up front what we have and have not shipped against.

## Do you keep access to our code or infrastructure after the engagement?

No. All credentials are revoked at the end of the engagement. The code stays with you, we do not keep a copy of your repository. If you want a retainer (Phase 4), we sign a new NDA and contract for that scope.

## Can we use just one component, or buy it outright?

Yes. Each component can stand on its own, so we can scope a single piece if that is all you need. What teams engage us for is the hard part: composing the six into one platform, integrating it into your stack, hardening it for production, and staying with you as it evolves. Running them together as a system at enterprise scale is the partnership.

## Where do the -88% and -43% numbers come from?

Both are from VirtusLab client engagements. The -88% build-time figure comes from a global logistics company where we migrated a Scala monorepo from sbt to Bazel (40-60 minutes down to around 5). The -43% PR merge time comes from an investment bank running a managed IntelliJ IDEA solution on a Scala monorepo. Clients are under NDA. Full write-ups live on the VirtusLab success stories page.

---

Not here? Email visdom@virtuslab.com, an engineer will reply within one business day.
