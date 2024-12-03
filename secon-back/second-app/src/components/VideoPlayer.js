
const VideoPlayer = ({filepath,videotype,width,height,loop,controls = true,autoPlay=false,className}) => {
    return ( 
        <video 
            onClick ={(e) => {e.stopPropagation()}}
            width={width || `100%`}
            height={height || `100%`}
            controls={controls}
            autoPlay={autoPlay}
            loop={loop}
            className={className}
        >
            <source src={filepath} type={`${videotype}`}/>
            not supported vedio type
        </video>
     );
}
 
export default VideoPlayer;