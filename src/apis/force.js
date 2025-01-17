import axios from './index'

export const queryFriend = payload => {
  return axios.post('/tarsier-eam/cmdb/dataSet/queryFriend', payload)
}
