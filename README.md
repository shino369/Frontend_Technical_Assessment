# Doctor Booking System

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Author: Anthony Wong
## Overview

Code test for Bowtie frontend engineer interview.\
Perform CRUD for doctor appointment.\
[deployed to netlify](https://62b76949fe722135ab6bb13b--loquacious-cassata-5727ac.netlify.app/)

### `Choice of Package`

UI Library: MUI, rsuite, react-bootstrap, reactstrap, react-toastify.\
MUI:                mainly use for stepper component. \
                    benefit - no need to write by yourself. \
                    drawback -  troublesome to overwrite style.\
rsuite:             use for Icon and Datepicker. \
                    benedit - rsuite datepicker can disable specific day.\
                    drawback - cannot use native datepicker.\
react-bootstrap:    Carousel, Select.\
                    benefit - simple.\
                    drawback - no.\
reactstrap:         Input\
                    benefit - simple.\
                    drawback - no.\
react-toastify:     Toast.\
                    benefit - cool effect.\
                    drawback - troublesome to overwrite style.

Form control: Formik, react-hook-form, yup.\
Formik:             use for booking.\
                    benefit - easy to use.\
                    drawback - all input must wrap by formik, submit cannot be done outside.\
react-hook-form     use for update booking record.\
                    benefit - easy to use. input can be wrapped by controller. submit button can be placed anywhere.\
                    drawback - no.\


### `Potential Improvement`

Will put more effort on responsive design, especially mobile.

### `Production consideration`

Hide all console.log

```
if (process.env.NODE_ENV === "production") {
    console.log = function () {};
}
```

### `Assumptions`

I assumed that record after submit can be amended, i.e. date/timeslot, and the API scheme also stated that it acceptthe fields\
but as a result only confirmed/cancelled can be changed.\
And the list cannot be sorted by created time.


Also for the available timeslot, for example 09:50 - 19:50 (you use 9.50 - 19.50 though), 19:00 seems to be a reasonable time but server reject it.\
And don't know why it accept numberic (e.g. 18) instead of string (e.g. "18:00")
