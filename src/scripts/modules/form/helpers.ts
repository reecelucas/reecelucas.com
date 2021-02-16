type InsertMessageParams = {
  element: Element;
  message: string;
  classList: string;
  position?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isFormInput = (target: HTMLElement): boolean => {
  const { nodeName } = target;

  return (
    target &&
    (nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'SELECT')
  );
};

export const insertMessage = ({
  element,
  message,
  classList,
  position = 'afterend'
}: InsertMessageParams): void => {
  element.insertAdjacentHTML(
    position,
    `<span class="form-message ${classList}" role="alert" aria-live="assertive">
      ${message}
    </span>`
  );
};

export const removeElement = (elem: Element): void => {
  elem.remove();
};

export const getFormData = (form: HTMLFormElement): string => {
  const formData = Array.from(new FormData(form));

  return JSON.stringify(
    formData.reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value
      }),
      {}
    )
  );
};
