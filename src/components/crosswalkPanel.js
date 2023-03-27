import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

export default function CrosswalkPanel({ open, setOpen, marker, session, edit }) {
  
  const [form, setForm] = useState(() => {
    if (!edit) {
      return {
        address: '',
        description: '',
      }
    }

    return {
      address: marker.address,
      description: marker.description,
    };
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    // Prevent automatic redirect
    e.preventDefault();

    // Close the side panel
    setOpen(false)
    
    // Quick n dirty validation
    if (!form.address || !form.description) {
      alert('fill in the damn form')
    }

    const userId = session.user.email;
    const userName = session.user.name;
    const lat = marker.lat;
    const lng = marker.lng;
    const address = form.address;
    const description = form.description;

    let markerId;
    if (marker && edit) {
      markerId = marker.id
    }
  
    // Add to db if new entry
    if (!edit) {
      await axios.post("/api/db/createCrosswalk", {
        userId, userName, lat, lng, address, description
      }).then(res => {
        // jump to new marker location
        window.location.replace(`/${marker.lng},${marker.lat},18`)
      }).catch(error => {
        console.log(error.response.data)
        alert('try again')
      })
    } else {
      // Update in db if not new entry
      await axios.post("/api/db/updateCrosswalk", {
        markerId, address, description
      }).then(res => {
        window.location.replace('/myCrosswalks')
      }).catch(error => {
        console.log(error.response.data)
      })
    }
    
    
  }
  return ( session &&
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
      <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex md:w-1/2 max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen w-full">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">Tell us about your suggested crosswalk</h3>
                          <p className="mt-1 text-sm text-gray-500">People can read this information, vote to agree, and share their thoughts.</p>
                        </div>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <form className="space-y-8 divide-y divide-gray-200">
                          <div className="space-y-8 divide-y divide-gray-200">
                            <div className="space-y-6">
                              
                              <div className="sm:col-span-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                  Give your crosswalk a descriptive address *
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="e.g. intersection of Avenue and Cumberland"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </div>


                              <div>
                                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                  Describe why this location needs a new crosswalk *
                                </label>
                                <div className="mt-1">
                                  <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="e.g. lots of people cross from Cumberland to get breakfast at the Hyatt and cars are absolutely flooring it down Avenue"
                                    value={form.description}
                                    onChange={handleChange}
                                  />
                                </div>
                                </div>
                            </div>

                            
                            <div className="pt-8">
                              
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Your suggestion will be live shortly after you submit.</h3>
                                <p className="mt-1 text-sm text-gray-600 mb-2">
                                  Your name <span className='font-medium text-gray-900'>({session.user.name})</span> will be displayed alongside your suggestion.
                                </p>
                                <p className="block text-sm text-gray-600">In case of any issues, we'll contact you at: <span className='font-medium'>{session.user.email}</span></p>
                                
                            </div>
                          </div>

                          <div className="pt-5">
                            <div className='flex justify-between'>
                            <p className="block text-sm text-gray-400 italic">* Required</p>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => setOpen(false)}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={handleSubmit}
                              >
                                Submit
                              </button>
                            </div>
                            </div>
                            
                          </div>
                        </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
