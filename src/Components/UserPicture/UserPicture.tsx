import './UserPicture.scss'
const UserPicture: React.FunctionComponent<{
  picture: string, 
  username: string,
}> = (props) => {
  if (!props.username) return <></>
  if (props.picture.includes('http')) {
    return <>
      <div className={'profile_picture'}>
        <img src={props.picture} alt={`${props.username}'s profile pic`} className={'profile_picture__img'}></img>
      </div>
    </>
  }
  return <>
    <div className={'profile_picture'} style={{background: props.picture}}>
      <span className={'profile_picture__text'}>{props.username[0].toUpperCase()}</span>
    </div>
  </>
}
export default UserPicture