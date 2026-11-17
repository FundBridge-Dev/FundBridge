# FundBridge Design Document

Ankita Mandalam and Agilan Balaraman

## Project description

FundBridge is a funding and sponsorship platform for startups, student organizations, nonprofits, and community groups.

Funding opportunities such as grants, accelerators, fellowships, and pitch competitions are often scattered. Applicants have difficulty tracking deadlines, eligibility requirements, funding amounts, and application statuses.

Organizations planning hackathons, workshops, demo days, conferences, and product launches also struggle to find sponsors. Potential sponsors need a way to discover events, understand the audience, and evaluate the benefits of supporting each event.

FundBridge combines both needs into one application with two independent boards:

- **Opportunity Board:** Users can browse, search, filter, sort, and save funding opportunities.
- **Sponsorship Board:** Organizations can post sponsorship requests, while sponsors can discover events and projects that need support.

Anyone can browse both boards. Registered users can create posts, save items, track statuses, and manage their own content. Users can edit or delete only the posts they created.

The application uses React with Hooks for client-side rendering, a Node.js and Express backend, MongoDB through the native Node.js driver, and Passport for authentication.

## User personas

**Aisha - Student founder**

Aisha is building an early-stage climate startup. She is looking for non-dilutive grants and pitch competitions but does not have time to search many websites individually. She wants to filter opportunities by industry, startup stage, funding amount, equity requirements, and deadline.

**Daniel - Accelerator manager**

Daniel manages an accelerator program. He publishes funding opportunities and needs to keep organization information, eligibility requirements, funding amounts, deadlines, and application links accurate.

**Kenji - Student organization president**

Kenji is organizing a 200-person hackathon. He needs sponsorship funding and wants companies to understand the event audience, sponsor benefits, budget, and how much money has already been raised.

**Laura - Corporate sponsorship manager**

Laura manages sponsorships for a company. She wants to discover upcoming events that offer recruiting access, brand visibility, speaking opportunities, and access to relevant audiences.

## User stories

### Opportunity Board

**1. Managing a funding opportunity.** Daniel creates a funding opportunity with the organization, type, industry, startup stage, amount, equity requirement, eligibility, deadline, application link, and description. He can later edit or delete opportunities he created.

> As Daniel, I want to create, edit, and delete funding opportunities with the organization, type, industry, startup stage, amount, equity requirement, eligibility, deadline, application link, and description so that founders receive accurate information.

**2. Finding a suitable opportunity.** Aisha searches, filters, sorts, and pages through funding opportunities using type, industry, startup stage, funding amount, equity requirement, and deadline.

> As Aisha, I want to search, filter, and sort opportunities by type, industry, startup stage, funding amount, equity requirement, and deadline, with paginated results, so that I can find opportunities that fit my startup.

**3. Checking opportunity status.** Aisha checks whether an opportunity is open, closing soon, or closed so she can prioritize upcoming applications.

> As Aisha, I want to see whether each opportunity is open, closing soon, or closed so that I can prioritize upcoming applications.

**4. Tracking applications.** Aisha saves opportunities, marks them as planning to apply, applied, or skipped, and removes them later when they are no longer relevant.

> As Aisha, I want to save opportunities to my account, mark them as planning to apply, applied, or skipped, and remove them later so that I can track my applications.

### Sponsorship Board

**1. Managing a sponsorship request.** Kenji creates a sponsorship request with the event type, date, budget, audience size, location, sponsor benefits, and description. He can later edit or delete requests he created.

> As Kenji, I want to create, edit, and delete sponsorship requests with the event type, date, budget, audience size, location, sponsor benefits, and description so that companies understand what support we need.

**2. Tracking sponsorship progress.** Kenji updates the amount raised for his event. The request displays a funding progress bar so sponsors can see how much support is still needed.

> As Kenji, I want to update the amount raised and show a funding progress bar on my request so that sponsors know how much support is still needed.

**3. Finding sponsorship opportunities.** Laura searches, filters, sorts, and pages through sponsorship requests using event type, budget, date, audience size, location, and benefits offered.

> As Laura, I want to search, filter, and sort requests by event type, budget, date, audience size, location, and benefits offered, with paginated results, so I can find suitable sponsorship opportunities.

**4. Tracking potential partnerships.** Laura saves sponsorship requests and marks them as under review, contacted, approved, or declined. She can remove saved requests later.

> As Laura, I want to save sponsorship requests to my account, mark them as under review, contacted, approved, or declined, and remove them later so that I can manage potential partnerships.

## Design mockups
Each page has a wireframe, which shows its layout and structure, followed by a high-fidelity mockup, which shows the finished design with realistic content. The mockups are shown from the point of view of the persona in each user story.

### Home page

The home page introduces both boards, links to each one, and explains how to use FundBridge, so new visitors know what they can do before creating an account.

![Home page wireframe](wireframes/home-page-wireframe.png)

![Home page high-fidelity mockup](mockups/home-page-high-fidelity.png)

### Log in and sign up

One form handles both logging in and creating an account, with a link to switch between the two. After logging in, users return to the page they were trying to reach.

![Log in page wireframe](wireframes/login-page-wireframe.png)

![Log in page high-fidelity mockup](mockups/login-page-high-fidelity.png)

### Opportunity Board

The board lets Aisha search, filter by type, industry, stage, amount range, equity, deadline, and status, sort, and page through results. Each card shows whether the opportunity is open, closing soon, or closed. Logged-in users can save opportunities directly from the cards, and post new ones.

![Opportunity Board wireframe](wireframes/opportunity-board-wireframe.png)

![Opportunity Board high-fidelity mockup](mockups/opportunity-board-high-fidelity.png)

### Opportunity detail

The detail page shows every field of an opportunity, a link to apply on the organization's site, and a control to save it. Only the author, Daniel in this mockup, sees the section to edit or delete the post.

![Opportunity detail wireframe](wireframes/opportunity-detail-wireframe.png)

![Opportunity detail high-fidelity mockup](mockups/opportunity-detail-high-fidelity.png)

### Post or edit an opportunity

One form is used for both posting and editing, with every field from Daniel's story. When editing, it opens with the opportunity's saved values.

![Opportunity form wireframe](wireframes/opportunity-form-wireframe.png)

![Opportunity form high-fidelity mockup](mockups/opportunity-form-high-fidelity.png)

### Saved opportunities

Aisha's saved opportunities are listed with the soonest deadline first. Tabs filter by status and show a count for each, and each item's status can be changed between planning to apply, applied, and skipped, or removed.

![Saved opportunities wireframe](wireframes/saved-opportunities-wireframe.png)

![Saved opportunities high-fidelity mockup](mockups/saved-opportunities-high-fidelity.png)

### Sponsorship Board

The board lets Laura search, filter by event type and location, sort, and page through sponsorship requests. Each card shows the event date, budget, audience size, and a funding progress bar, so sponsors can see how much support is still needed.

![Sponsorship Board wireframe](wireframes/sponsorship-board-wireframe.png)

![Sponsorship Board high-fidelity mockup](mockups/sponsorship-board-high-fidelity.png)

### Sponsorship request detail

The detail page shows the event's details, sponsor benefits, description, and funding progress. Logged-in users can save the request. Only the author, Kenji in this mockup, can update the amount raised, edit the request, or delete it.

![Sponsorship request detail wireframe](wireframes/sponsorship-detail-wireframe.png)

![Sponsorship request detail high-fidelity mockup](mockups/sponsorship-detail-high-fidelity.png)

### Create or edit a sponsorship request

One form is used for both creating and editing a request, with the event type, date, budget, audience size, location, sponsor benefits, and description from Kenji's story. The amount raised is updated separately from the request's detail page.

![Sponsorship form wireframe](wireframes/sponsorship-form-wireframe.png)

![Sponsorship form high-fidelity mockup](mockups/sponsorship-form-high-fidelity.png)

### Saved sponsorship requests

Laura's saved requests are listed with a partnership decision for each: under review, contacted, approved, or declined. She can change the decision or remove a request.

![Saved sponsorship requests wireframe](wireframes/saved-requests-wireframe.png)

![Saved sponsorship requests high-fidelity mockup](mockups/saved-requests-high-fidelity.png)