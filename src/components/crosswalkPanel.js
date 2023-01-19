import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

export default function CrosswalkPanel({ open, setOpen, marker, session, edit }) {
  // edit is a bool; false = new crosswalk
  console.log(marker)
  
  // const [form, setForm] = useState({
  //   address: '', // TODO idk what this does if null but idea is take marker value if possible
  //   description: '',
  //   shareInfo: 'nameImage',
  // });

  // const [form, setForm] = useState(marker ? {address: marker.address, description: marker.description, shareInfo: marker.shareInfo}:{address: '', description: '', shareInfo: ''})

  const [form, setForm] = useState(() => {
    if (!edit) {
      return {
        address: '',
        description: '',
        shareInfo: ''
      }
    }

    return {
      address: marker.address,
      description: marker.description,
      shareInfo: marker.shareInfo
    };
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    // prevent automatic redirect
    e.preventDefault();

    // close the panel
    setOpen(false)
    
    // dirty validation
    if (!form.address || !form.description) {
      alert('fill in the damn form')
    }

    const userId = session.user.email;
    const lat = marker.lat;
    const lng = marker.lng;
    const address = form.address;
    const description = form.description;
    const shareInfo = form.shareInfo;

    let markerId;
    if (marker && edit) {
      markerId = marker.id
    }
  
    // add to db if new entry
    if (!edit) {
      await axios.post("/api/db/createCrosswalk", {
        userId, lat, lng, address, description, shareInfo
      }).then(res => {
        // jump to new marker location
        window.location.replace(`/${marker.lng},${marker.lat},15`)
      }).catch(error => {
        console.log(error.response.data)
        alert('try again')
      })
    } else {
      // update in db if not new entry
      await axios.post("/api/db/updateCrosswalk", {
        userId, markerId, address, description, shareInfo
      })
    }
    
    
  }
  return (
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
            <div className="pointer-events-none fixed inset-y-0 right-0 flex w-1/2 max-w-full pl-10">
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
                      {/* Replace with your content */}
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
                                  {/* <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p> */}
                                </div>

                                <div className="sm:col-span-6">
                                  <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
                                    Show us the crosswalk location
                                  </label>
                                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                                    <div className="space-y-1 text-center">
                                      <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                      >
                                        <path
                                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      <div className="flex text-sm text-gray-600">
                                        <label
                                          htmlFor="file-upload"
                                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                          <span>Upload a file</span>
                                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                      </div>
                                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                  </div>
                                </div>
                            </div>

                            

                            <div className="pt-8 space-y-6">
                              <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Other</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  Some wrap-up details from us.
                                </p>
                              </div>
                              <div>
                                <div>
                                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    What information would you like to share pubicly alongside your suggested crosswalk? *
                                  </label>
                                  <select
                                    id="shareInfo"
                                    name="shareInfo"
                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    value={form.shareInfo}
                                    onChange={handleChange}
                                  >
                                    <option value='nameImage'>Name ({session.user.name}) and Profile Image</option>
                                    <option value='nameOnly'>Name only ({session.user.name})</option>
                                    <option value='anon'>Anonymous</option>
                                  </select>
                                </div>
                               
                              </div>
                              <div>
                                <p className="block text-sm font-medium text-gray-700">Your suggestion will be live shortly after you submit.</p>
                                <p className="block text-sm text-gray-500">In case of any issues, we'll contact you at: <span className='text-gray-700 font-medium'>{session.user.email}</span></p>
                                
                              </div>
                            </div>
                          </div>

                          <div className="pt-5">
                            <div className='flex justify-between'>
                            <p className="block text-sm text-gray-400 italic">* Required</p>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={handleSubmit}
                              >
                                {edit ? <p>Submit Changes</p> : <p>Submit</p>}
                                {/* Submit */}
                              </button>
                            </div>
                            </div>
                            
                          </div>
                        </form>
                      {/* /End replace */}
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
