import React from "react"
import { render } from "@testing-library/react"
import { defer, Subject } from "rxjs"
import { share, finalize } from "rxjs/operators"
import { Subscribe } from "./"

describe("Subscribe", () => {
  it("subscribes to the provided observable and remains subscribed until it's unmounted", () => {
    let nSubscriptions = 0
    const source$ = defer(() => {
      nSubscriptions++
      return new Subject()
    }).pipe(
      finalize(() => {
        nSubscriptions--
      }),
      share(),
    )

    const TestSubscribe: React.FC = () => <Subscribe source$={source$} />

    expect(nSubscriptions).toBe(0)

    const { unmount } = render(<TestSubscribe />)

    expect(nSubscriptions).toBe(1)

    unmount()
    expect(nSubscriptions).toBe(0)
  })
})