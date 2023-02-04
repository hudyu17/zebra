import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

export default function Copied({ show, setShow }) {
//   const [show, setShow] = useState(true)

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none z-30 fixed inset-0 flex items-end px-4 py-6 lg:items-start lg:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 lg:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 lg:translate-y-0 lg:translate-x-2"
            enterTo="translate-y-0 opacity-100 lg:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">Link copied!</p>
                    <p className="mt-1 text-sm text-gray-500">Anyone with the link can view this crosswalk.</p>
                  </div>
                 
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}
