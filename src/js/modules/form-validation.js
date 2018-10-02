const form = document.querySelector('form');
const config = {
  errorAttribute: 'aria-invalid',
  errorClass: 'error'
};

// Helpers
const isFormInput = target => {
  const { nodeName } = target;

  return (
    target &&
    (nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'SELECT')
  );
};

const hasError = field => {
  const { nextSibling } = field;
  const hasErrorAttribute = field.hasAttribute(config.errorAttribute);
  const hasErrorMessage =
    nextSibling &&
    nextSibling.classList &&
    nextSibling.classList.contains(config.errorClass);

  return hasErrorAttribute && hasErrorMessage;
};

const setError = field => {
  if (hasError(field)) return;

  field.setAttribute(config.errorAttribute, true);
  field.insertAdjacentHTML(
    'afterend',
    `<span class=${config.errorClass} role="alert" aria-live="assertive">
        ${field.validationMessage}
    </span>`
  );
};

const removeError = field => {
  if (!hasError(field)) return;

  field.removeAttribute(config.errorAttribute);
  form.removeChild(field.nextSibling);
};

// Event handlers
const onBlur = field => {
  removeError(field);
  field.checkValidity();
};

const onInvalid = field => {
  setError(field);
};

const onSubmit = event => {
  if (event.target.checkValidity()) return;

  event.preventDefault();

  // Assign focus to first input with error
  const firstInvalidField = form.querySelector(`[${config.errorAttribute}]`);
  firstInvalidField.focus();
};

export default () => {
  if (!form) return;

  form.noValidate = true;

  form.addEventListener(
    'blur',
    ({ target }) => {
      if (isFormInput(target)) {
        onBlur(target);
      }
    },
    true
  );

  form.addEventListener(
    'invalid',
    ({ target }) => {
      if (isFormInput(target)) {
        onInvalid(target);
      }
    },
    true
  );

  form.addEventListener('submit', onSubmit);
};
