import Allpaymentslist from './Allpaymentswrapper';

function Paymentstab({ flat_id, customerId }) {
    return (
        <div className="flex flex-col w-full gap-4 overflow-x-auto">
            <Allpaymentslist flat_id={flat_id} customerId={customerId} />
        </div>
    );
}

export default Paymentstab;