import React from 'react'
import CaseAction from './CaseAction'
import CaseDetails from './CaseDetails'
import CaseOverview from './CaseOverview'
const Cases = () => {
  return (
    <div>
      cases
      <CaseOverview />
      <CaseDetails />
      <CaseAction />
    </div>
  )
}

export default Cases
