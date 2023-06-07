/**
 * Landing page for the app.
 */

import Button from '../../components/Button.js';
import Navbar from '../../components/NavBar.js';
import receiptJsonParser from '../ocr/ReceiptJsonParser.js';

export default function About() {
  return (
    <div className='flex flex-col gap-6'>
      <Navbar />
      <Button text='Parse Receipt' onClick={() => receiptJsonParser(/** insert data here */)} />
      <div>
        FareShare is a bill spllitting web app that helps students
        automatically split bills and at the same time track their
        expenditure in the most efficient and effortless way possible.
      </div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue odio convallis scelerisque mattis. Sed sed est massa. Ut posuere, metus non efficitur consectetur, nunc neque blandit lorem, ut semper arcu lectus in sapien. Vestibulum justo eros, scelerisque et nulla a, interdum porta ante. Cras vitae posuere tellus. Donec fermentum euismod consectetur. Nullam sem tellus, volutpat a purus eget, commodo bibendum sem. Mauris ullamcorper risus efficitur turpis rhoncus, at condimentum diam porttitor. Suspendisse venenatis dignissim auctor.
      </div>
      <div>
        Pellentesque ac semper elit. Nullam commodo vulputate sem quis mattis. Duis sit amet tortor ut elit pharetra tempus in in ex. Pellentesque ut justo turpis. Pellentesque dictum eu elit in pretium. Quisque maximus tempus erat, nec ultricies dui lacinia eu. Quisque fermentum dolor ac turpis pretium, vitae tincidunt purus blandit. Suspendisse eget accumsan velit. Curabitur porta finibus nisl id euismod. Ut laoreet lobortis risus at tristique. Aliquam convallis orci a massa facilisis tristique. Nullam est velit, rutrum eget dignissim consequat, hendrerit nec nibh. Duis faucibus, ex ac tincidunt molestie, tellus lorem tincidunt urna, tincidunt finibus nibh magna tincidunt mauris. Mauris finibus turpis et eleifend imperdiet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </div>
    </div>
  );
}