import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";

const Text = () => {
     const { windows } = useWindowStore();
     const data = windows?.txtfile?.data;

     if (!data) return null;

     const { name, image, imageUrl, subtitle, description = [] } = data;

     return (
          <>
               <div id="window-header">
                    <WindowControls target="txtfile" />
                    <h2>{name}</h2>
               </div>

               <div className="p-4">
                    {(image || imageUrl) && (
                         <img src={image || imageUrl} alt={name} className="mb-4 w-full max-h-48 object-cover" />
                    )}

                    {subtitle && <h3 className="text-lg font-medium mb-2">{subtitle}</h3>}

                    {description.map((para, i) => (
                         <p key={i} className="mb-3 text-sm leading-relaxed">{para}</p>
                    ))}
               </div>
          </>
     );
};

const TextWindow = WindowWrapper(Text, "txtfile");

export default TextWindow;
