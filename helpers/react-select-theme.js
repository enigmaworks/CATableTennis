export default function (basetheme) {
  return {
      ...basetheme,
      colors: {
        ...basetheme.colors,
        primary: '#df8c20',
        primary25:'#e8e8e8',
        primary50:'#40404044',
        neutral20:'#40404088',
        neutral30: "#404040"
      },
  }
}