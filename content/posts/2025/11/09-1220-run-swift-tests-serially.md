---
title: How to run Swift Tests Serially across files
description: Here's how I am running Swift Tests serially. Note, this is using Swift Testing.
date: 2025-11-09
categories: [swift, swift-testing]
---

I'm going to list the guide first and then why I needed to do this.

> [!NOTE]
>
> This is using [Swift Testing](https://developer.apple.com/documentation/testing)


## Guide

1. Create a main test Suite and mark it as `@Suite(.serialized)`

```swift
import Testing

@Suite(.serialized)
struct MainTestSuite {
}
```

2. Make an extension on the struct and put your other Suite in side it and also mark it as `@Suite(.serialized)`

```swift
extension MainTestSuite {
    @Suite(.serialized)
    struct SubTestSuiteA {
        @Test
        func testA() {
            #expect(true)
        }
    }
}
```

Repeat as you need to for all your suites

3. Run your tests and your tests should ruin serially. In my testing, they are ran in alphabetical order.

## Why I needed this

I am working on FetchKit, a user feedback system for my apps (and maybe yours), and I need to write tests for the repositories, which is what acceses the databases. Since I am testing reading and writing from databases, I want to just use one test database. At the end of each test, I clean up the databse and erase everything so if tests are running parallel the data the test expected to be there could be wiped. **DEFINITELY DO NOT WANT THAT.** 

A lot of the examples I saw online showed:

```swift
import Testing

@Suite(.serialized)
struct MainTestSuite {
    @Suite(.serialized)
    struct SubTestSuiteA {
        @Test
        func testA() {
            #expect(true)
        }
    }
    @Suite(.serialized)
    struct SubTestSuiteB {
        @Test
        func testB() {
            #expect(true)
        }
    }
}
```

This is fine and ultimately nothing wrong with it, except for the file gets really massive, and I'm not a fan of that. I tried asking AI and well that was a bust, so I just tried writing the "sub" test suites in extensions and it worked.

---

## What is FetchKit?

FetchKit is a feedback management system that helps developers collect, organize, and act on user feedback directly from their applications. Instead of relying on scattered feedback from app stores, support emails, and social media, FetchKit lets you capture feedback where it matters most: inside your app.

If you're interested in FetchKit, then make sure to join the waitlist, and you'll get weekly updates with the chance to sign up for the beta.

<style>@import url('https://fonts.googleapis.com/css2?family=Inter,family=Open+Sans,family=Source+Sans+Pro&display=swap');</style><div class="newsletter-form-container"><form class="newsletter-form" action="https://app.loops.so/api/newsletter-form/cmebqyzik0aseve0in62w5oj7" method="POST" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;"><input class="newsletter-form-input" placeholder="you@example.com" required="" type="email" name="newsletter-form-input" style="font-family: 'Open Sans', sans-serif; color: rgb(0, 0, 0); font-size: 14px; margin: 0px 0px 10px; width: 100%; max-width: 300px; min-width: 100px; background: rgb(255, 255, 255); border: 1px solid rgb(209, 213, 219); box-sizing: border-box; box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px; border-radius: 6px; padding: 8px 12px;"><button type="submit" class="newsletter-form-button" style="background: rgb(210, 255, 31); font-size: 14px; color: rgb(56, 97, 140); font-family: 'Source Sans Pro', sans-serif; display: flex; width: 100%; max-width: 300px; white-space: normal; height: 38px; align-items: center; justify-content: center; flex-direction: row; padding: 9px 17px; box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px; border-radius: 6px; text-align: center; font-style: normal; font-weight: 500; line-height: 20px; border: none; cursor: pointer;">Join Waitlist</button><button type="button" class="newsletter-loading-button" style="background: rgb(210, 255, 31); font-size: 14px; color: rgb(56, 97, 140); font-family: 'Source Sans Pro', sans-serif; display: none; width: 100%; max-width: 300px; white-space: normal; height: 38px; align-items: center; justify-content: center; flex-direction: row; padding: 9px 17px; box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px; border-radius: 6px; text-align: center; font-style: normal; font-weight: 500; line-height: 20px; border: none; cursor: pointer;">Please wait...</button></form><div class="newsletter-success" style="display: none; align-items: center; justify-content: center; width: 100%;"><p class="newsletter-success-message" style="font-family: 'Open Sans', sans-serif; color: rgb(0, 0, 0); font-size: 17px;">Thanks for your interest in FetchKit! I'll send you your first update shortly!</p></div><div class="newsletter-error" style="display: none; align-items: center; justify-content: center; width: 100%;"><p class="newsletter-error-message" style="font-family: 'Open Sans', sans-serif; color: rgb(185, 28, 28); font-size: 17px;">Oops! Something went wrong, please try again</p></div>
<button 
class='newsletter-back-button'
type='button' 
style='color:#6b7280;font: 14px, Inter, sans-serif;margin:10px auto;text-align:center;display:none;background:transparent;border:none;cursor:pointer'
onmouseout='this.style.textDecoration="none"' 
onmouseover='this.style.textDecoration="underline"'>
&larr; Back
</button>
</div>

<script type="text/javascript">
function submitHandler(event) {
  event.preventDefault();
  // event.currentTarget is the form element (the element the listener is attached to)
  var form = event.currentTarget;
  var container = form.parentNode;
  var formInput = container.querySelector(".newsletter-form-input") || form.querySelector(".newsletter-form-input") || form.querySelector('input[type="email"]');
  var success = container.querySelector(".newsletter-success");
  var errorContainer = container.querySelector(".newsletter-error");
  var errorMessage = container.querySelector(".newsletter-error-message");
  var backButton = container.querySelector(".newsletter-back-button");
  var submitButton = container.querySelector(".newsletter-form-button");
  var loadingButton = container.querySelector(".newsletter-loading-button");
  
  if (!formInput) {
    console.error("Could not find email input");
    return;
  }

  const rateLimit = () => {
    errorContainer.style.display = "flex";
    errorMessage.innerText = "Too many signups, please try again in a little while";
    submitButton.style.display = "none";
    formInput.style.display = "none";
    backButton.style.display = "block";
  }

  // Compare current time with time of previous sign up
  var time = new Date();
  var timestamp = time.valueOf();
  var previousTimestamp = localStorage.getItem("loops-form-timestamp");

  // If last sign up was less than a minute ago
  // display error
  if (previousTimestamp && Number(previousTimestamp) + 60000 > timestamp) {
    rateLimit();
    return;
  }
  localStorage.setItem("loops-form-timestamp", timestamp);

  // Get email value from the input
  var emailValue = formInput.value ? formInput.value.trim() : "";
  console.log("Email value captured:", emailValue); // Debug log
  if (!emailValue) {
    errorContainer.style.display = "flex";
    errorMessage.innerText = "Please enter an email address.";
    submitButton.style.display = "flex";
    loadingButton.style.display = "none";
    return;
  }

  submitButton.style.display = "none";
  loadingButton.style.display = "flex";

  // Build form body - Loops API expects email parameter
  var formBody = "userGroup=FetchKit&mailingLists=cmhs6l3rr3uec0izm5fftcge3&email=" 
    + encodeURIComponent(emailValue)
    ;
  console.log("Form body being sent:", formBody); // Debug log

  fetch(form.action, {
    method: "POST",
    body: formBody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => [res.ok, res.json(), res])
    .then(([ok, dataPromise, res]) => {
      if (ok) {
        // If response successful
        // display success
        success.style.display = "flex";
        form.reset();
      } else {
        // If response unsuccessful
        // display error message or response status
        dataPromise.then(data => {
          errorContainer.style.display = "flex";
          errorMessage.innerText = data.message
            ? data.message
            : res.statusText;
        });
      }
    })
    .catch(error => {
      // check for cloudflare error
      if (error.message === "Failed to fetch") {
        rateLimit();
        return;
      }
      // If error caught
      // display error message if available
      errorContainer.style.display = "flex";
      if (error.message) errorMessage.innerText = error.message;
      localStorage.setItem("loops-form-timestamp", '');
    })
    .finally(() => {
      formInput.style.display = "none";
      loadingButton.style.display = "none";
      backButton.style.display = "block";
    });
}
function resetFormHandler(event) {
  var container = event.target.parentNode;
  var formInput = container.querySelector(".newsletter-form-input");
  var success = container.querySelector(".newsletter-success");
  var errorContainer = container.querySelector(".newsletter-error");
  var errorMessage = container.querySelector(".newsletter-error-message");
  var backButton = container.querySelector(".newsletter-back-button");
  var submitButton = container.querySelector(".newsletter-form-button");

  success.style.display = "none";
  errorContainer.style.display = "none";
  errorMessage.innerText = "Oops! Something went wrong, please try again";
  backButton.style.display = "none";
  formInput.style.display = "flex";
  submitButton.style.display = "flex";
}

var formContainers = document.getElementsByClassName(
  "newsletter-form-container"
);

for (var i = 0; i < formContainers.length; i++) {
  var formContainer = formContainers[i]
  var handlersAdded = formContainer.classList.contains('newsletter-handlers-added')
  if (handlersAdded) continue;
  formContainer
    .querySelector(".newsletter-form")
    .addEventListener("submit", submitHandler);
  formContainer
    .querySelector(".newsletter-back-button")
    .addEventListener("click", resetFormHandler);
  formContainer.classList.add("newsletter-handlers-added");
}
</script>