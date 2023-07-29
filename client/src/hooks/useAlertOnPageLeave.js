const useAlertOnPageLeave = (condition, content) => {
    window.onbeforeunload = function(){
        if(condition) {
            return content;
        }
        else {
            return null;
        }
    }
}

export default useAlertOnPageLeave;
