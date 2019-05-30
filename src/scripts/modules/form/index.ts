import afterDelay from '../../helpers/afterDelay';
import {
  isFormInput,
  insertMessage,
  removeElement,
  getFormData
} from './helpers';

const form = document.querySelector('form');
const submitButton = document.querySelector('[data-form-submit]') as HTMLButtonElement; // prettier-ignore
const config = {
  btnText: (submitButton && submitButton.innerText) || 'send',
  errorAttribute: 'aria-invalid',
  errorClass: 'form-message--error',
  successClass: 'form-message--success u-spaced-small'
};

const hasError = (field: HTMLFormElement): boolean => {
  const { nextElementSibling } = field;
  const hasErrorAttr = field.hasAttribute(config.errorAttribute);
  const hasErrorMsg =
    nextElementSibling &&
    nextElementSibling.classList.contains(config.errorClass);

  return hasErrorAttr && hasErrorMsg;
};

const addFieldError = (field: HTMLFormElement) => {
  if (hasError(field)) {
    return;
  }

  field.setAttribute(config.errorAttribute, 'true');
  insertMessage({
    element: field,
    classList: config.errorClass,
    message: field.validationMessage
  });
};

const removeFieldError = (field: HTMLFormElement) => {
  if (!hasError(field)) {
    return;
  }

  field.removeAttribute(config.errorAttribute);
  removeElement(field.nextElementSibling);
};

const addLoadingIndicator = () => {
  submitButton.innerText = 'Submitting...';
  submitButton.disabled = true;
};

const removeLoadingIndicator = () => {
  submitButton.innerText = config.btnText;
  submitButton.disabled = false;
};

const handleSubmitError = (error: Error) => {
  insertMessage({
    element: submitButton,
    classList: `${config.errorClass} u-spaced-small`,
    message: error.message,
    position: 'beforebegin'
  });

  console.error(error);
};

const handleSubmitSuccess = (response: Response) => {
  if (!response.ok) {
    throw new Error('Response was not ok.');
  }

  insertMessage({
    element: submitButton,
    classList: config.successClass,
    message: 'Your message was sent successfully.',
    position: 'beforebegin'
  });

  afterDelay(() => {
    removeElement(submitButton.previousElementSibling);
    form.reset();
  }, 2000);
};

const handleSubmit = () => {
  let timerId;
  const requestOptions: any = {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    mode: 'cors',
    body: getFormData(form)
  };

  timerId = setTimeout(addLoadingIndicator, 250);

  fetch(process.env.CONTACT_FORM_URL, requestOptions)
    .then(handleSubmitSuccess)
    .catch(handleSubmitError)
    .finally(() => {
      clearTimeout(timerId);
      removeLoadingIndicator();
    });
};

// Event handlers
const onBlur = (field: HTMLFormElement) => {
  removeFieldError(field);
  field.checkValidity();
};

const onInvalid = (field: HTMLFormElement) => {
  addFieldError(field);
};

const onSubmit = (event: Event) => {
  event.preventDefault();
  const { target } = event;

  if (!target || !(target instanceof HTMLFormElement)) {
    return;
  }

  if (target.checkValidity()) {
    handleSubmit();
    return;
  }

  // The form contains errors, so we assign focus to the first invalid field
  const firstInvalidField = form.querySelector(`[${config.errorAttribute}]`);
  if (firstInvalidField instanceof HTMLElement) {
    firstInvalidField.focus();
  }
};

export default () => {
  if (!form || !submitButton) {
    return;
  }

  form.noValidate = true;

  form.addEventListener(
    'blur',
    ({ target }) => {
      const element = target as HTMLFormElement;

      if (isFormInput(element)) {
        onBlur(element);
      }
    },
    true
  );

  form.addEventListener(
    'invalid',
    ({ target }) => {
      const element = target as HTMLFormElement;

      if (isFormInput(element)) {
        onInvalid(element);
      }
    },
    true
  );

  form.addEventListener('submit', onSubmit);
};
