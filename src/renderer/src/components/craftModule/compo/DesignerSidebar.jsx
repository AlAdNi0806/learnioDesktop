import React from 'react'
import { FormElements } from './FormElements'
import SidebarBtnElement from './SidebarBtnElement'
import useDesigner from '../../hooks/useDesigner'
import FormElementsSidebar from './FormElementsSidebar';
import PropertiesFormSidebar from './PropertiesFormSidebar';

function DesignerSidebar() {
  const { selectedElement } = useDesigner();
  return (
    <aside className='bg-black w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 borderl-2 border-muted p-4 overflow-y-auto h-full'>
      {!selectedElement && (
        <FormElementsSidebar />
      )}
      {selectedElement && (
        <PropertiesFormSidebar />
      )}
    </aside>
  )
}

export default DesignerSidebar