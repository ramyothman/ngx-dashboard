using System;
using System.Collections.Generic;
using System.Text;

namespace Festo.Common.Events
{
    public class LoadingEventArgs : EventArgs
    {
        private string _loadedData = "";
        private string _childData = "";
        private string _parentData = "";
        public LoadingEventArgs(string newValue,string childData,string parentData)
        {
          this._loadedData = newValue;
          this._childData = childData;
          this._parentData = parentData;
        }
        public string LoadedData
        {
            get { return _loadedData; }
        }


        public string ChildData
        {
            get { return _childData; }
        }

        public string ParentData
        {
            get { return _parentData; }
        }

    }
}
