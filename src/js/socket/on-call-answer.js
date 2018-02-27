import { createNewConnection, createOffer } from './../peer-connection'

export default data => {
  createNewConnection(data.user)
  createOffer(offerers[data.user], data.user)
}
