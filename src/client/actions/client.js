export const ALERT_POP = 'ALERT_POP'

export const alert = (message) => {
  console.log("creating alert");
  return {
    type: ALERT_POP,
    message
  }
}
