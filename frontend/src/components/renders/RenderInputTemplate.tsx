import React from 'react';

interface RenderInputTemplateProps {
    label: string;
    path: string;
    inline: boolean;
    filter: boolean;
}

export const RenderInputTemplate: React.FC<RenderInputTemplateProps> = ({
                                                            label,
                                                            path,
                                                            inline = false,
                                                            filter = false,
                                                        }) => {

    return (
        <><p>{label},{path}, {inline}, {filter}</p></>
    );
};
