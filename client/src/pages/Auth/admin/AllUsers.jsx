import { useEffect, useState } from "react";
import axios from "axios";
import ServerApi from "../../../api/serverApi";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users from the server with credentials

        const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(
          navigator.userAgent
        );
        if (isAppleDevice) {
          const response = await axios.get(ServerApi.allUsers.url, {
            headers: {
              "Content-Type": "application/json",
              affiliate: `${localStorage.getItem("affiliate")}`,
            },
            withCredentials: true, // Include credentials in the request
          });
          setUsers(response.data);
          return;
        }

        const response = await axios.get(ServerApi.allUsers.url, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials in the request
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 mt-10 md:mt-0">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
        User Details
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-xs md:text-sm lg:text-base">
                Email
              </th>
              <th className="px-4 py-2 border-b text-xs md:text-sm lg:text-base">
                Public Key
              </th>
              <th className="px-4 py-2 border-b text-xs md:text-sm lg:text-base">
                Private Key
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 text-xs md:text-sm lg:text-base"
                >
                  <td className="px-4 py-2 border-b text-center">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {user.publicKey}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {user.privateKey}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No user data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
