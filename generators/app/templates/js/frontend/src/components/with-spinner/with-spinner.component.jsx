import React from 'react';

import { SpinnerContainer, SpinnerOverlay} from './with-spinner.styles';

const Spinner = () => {
    return  (
        <SpinnerOverlay>
            <SpinnerContainer />
        </SpinnerOverlay>
    )
}

export default Spinner;